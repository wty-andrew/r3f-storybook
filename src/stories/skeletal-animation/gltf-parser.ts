import * as THREE from 'three'
import type { GLTFParser } from 'three-stdlib'
import * as R from 'rambda'

import type { Joint, Skeleton, Interpolation } from './types'
import { TransformTrack } from './track'

const _translation = new THREE.Vector3()
const _rotation = new THREE.Quaternion()
const _scale = new THREE.Vector3(1, 1, 1)

interface GLTFNode {
  name?: string
  children?: number[]
  matrix?: number[]
  translation?: number[]
  rotation?: number[]
  scale?: number[]
}

interface GLTFSkin {
  inverseBindMatrices: number
  joints: number[]
}

type TargetPath = 'translation' | 'rotation' | 'scale' // 'morphTargetInfluences'

interface AnimationChannel {
  sampler: number // the index of the sampler
  target: {
    node: number // the index of the node
    path: TargetPath // the property to animate
  }
}

interface AnimationSampler {
  input: number // the accessor index to get keyframe timestamps
  interpolation?: Interpolation
  output: number // the accessor index to get keyframe values
}

interface GLTFAnimation {
  name: string
  channels: AnimationChannel[]
  samplers: AnimationSampler[]
}

interface GLTF {
  animations?: GLTFAnimation[]
  nodes: GLTFNode[]
  skins?: GLTFSkin[]
}

const getTransform = (node: GLTFNode) => {
  const { matrix, translation, rotation, scale } = node
  const transform = new THREE.Matrix4()
  if (matrix) {
    return transform.fromArray(matrix)
  }

  translation ? _translation.fromArray(translation) : _translation.set(0, 0, 0)
  rotation ? _rotation.fromArray(rotation) : _rotation.set(0, 0, 0, 1)
  scale ? _scale.fromArray(scale) : _scale.set(1, 1, 1)
  return transform.compose(_translation, _rotation, _scale)
}

const getBuffer = (parser: GLTFParser, accessorIndex: number) =>
  parser.getDependency('accessor', accessorIndex) as Promise<THREE.BufferAttribute>

const nodeName = (node: GLTFNode, index: number) => node.name || `Node${index}`

// the parser is available only after loading the model with GLTFLoader
export const loadSkeleton = async (parser: GLTFParser): Promise<Skeleton> => {
  const { skins, nodes } = parser.json as GLTF
  if (!skins?.length) {
    throw new Error('No skin found in the glTF')
  }
  // only deal with the first skin for this simple implementation
  const skin = skins[0]
  const { array } = await getBuffer(parser, skin.inverseBindMatrices)

  const joints: Joint[] = skin.joints.map((nodeIndex, jointIndex) => {
    const node = nodes[nodeIndex]
    return {
      name: nodeName(node, nodeIndex),
      parent: null,
      children: [],
      localTransform: getTransform(node),
      inverseBindTransform: new THREE.Matrix4().fromArray(array, jointIndex * 16),
    }
  })

  const jointByNodeIndex = R.zipObj(skin.joints, joints)

  const populateRelationship = (nodeIndex: number, parent: Joint | null = null) => {
    const joint = jointByNodeIndex[nodeIndex]
    joint.parent = parent
    for (const childNodeIndex of nodes[nodeIndex].children || []) {
      joint.children.push(jointByNodeIndex[childNodeIndex])
      populateRelationship(childNodeIndex, joint)
    }
  }
  populateRelationship(skin.joints[0])

  return { joints }
}

const loadAnimation = async (animation: GLTFAnimation, parser: GLTFParser) => {
  const { channels, samplers } = animation
  const { nodes } = parser.json as GLTF
  const tracks: Record<string, TransformTrack> = {}

  for (const { target, sampler: samplerIndex } of channels) {
    const { node: nodeIndex, path } = target
    const targetNode = nodeName(nodes[nodeIndex], nodeIndex)
    const { input, output, interpolation } = samplers[samplerIndex]
    const [inputBuffer, outputBuffer] = await Promise.all(
      [input, output].map((i) => getBuffer(parser, i))
    )
    const timestamps = Array.from(inputBuffer.array)
    const values = Array.from(outputBuffer.array)
    const transformTrack = (tracks[targetNode] ||= new TransformTrack())

    switch (path) {
      case 'translation': {
        transformTrack.setTranslationTrack(timestamps, values, interpolation)
        break
      }
      case 'rotation': {
        transformTrack.setRotationTrack(timestamps, values, interpolation)
        break
      }
      case 'scale': {
        transformTrack.setScaleTrack(timestamps, values, interpolation)
        break
      }
    }
  }

  return tracks
}

export const loadAnimations = async (parser: GLTFParser) => {
  const { animations } = parser.json as GLTF
  if (!animations) {
    return {}
  }

  const names = animations.map((anim, index) => anim.name || `Animation${index}`)
  const anims = await Promise.all(animations.map((anim) => loadAnimation(anim, parser)))
  return R.zipObj(names, anims)
}
