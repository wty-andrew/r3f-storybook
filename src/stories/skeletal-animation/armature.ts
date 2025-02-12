import * as THREE from 'three'

import type { Joint } from './types'

const _yAxis = new THREE.Vector3(0, 1, 0)
const _vector = new THREE.Vector3()

export enum BonePrimaryAxis {
  X = 'X',
  Y = 'Y',
}

const boneMaterial = new THREE.MeshStandardMaterial({
  color: '#7e7f80',
  depthTest: false,
  depthWrite: false,
  transparent: true,
  opacity: 0.8,
})

const createBoneGeometry = (scale = 1, primaryAxis = BonePrimaryAxis.Y) => {
  // biome-ignore format:
  const vertices = new Float32Array([
       0.1, 0.1, -0.1,
      -0.1, 0.1,  0.1,
         0,   1,    0,
         0,   0,    0,
       0.1, 0.1,  0.1,
      -0.1, 0.1, -0.1,
    ])
  // biome-ignore format:
  const indices = [
      0, 2, 4,
      0, 4, 3,
      0, 3, 5,
      0, 5, 2,
      1, 2, 5,
      1, 5, 3,
      1, 3, 4,
      1, 4, 2,
    ]

  const indexedGeometry = new THREE.BufferGeometry()
  indexedGeometry.setIndex(indices)
  indexedGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))

  const geometry = indexedGeometry.toNonIndexed()
  geometry.computeVertexNormals()

  scale !== 1 && geometry.scale(scale, scale, scale)
  primaryAxis === BonePrimaryAxis.X && geometry.rotateZ(-Math.PI / 2)
  return geometry
}

const guessBoneLength = (joint: Joint) => {
  const length = ({ localTransform }: Joint) =>
    _vector.setFromMatrixPosition(localTransform).length()
  return joint.children.length ? Math.min(...joint.children.map(length)) : length(joint)
}

const guessBonePrimaryAxis = (joint: Joint) => {
  const weight = ({ localTransform }: Joint) =>
    _yAxis.dot(_vector.setFromMatrixPosition(localTransform).normalize())

  const traverse = (joint: Joint, numJoints: number, total: number): [number, number] =>
    joint.children.reduce(
      ([currJoints, currWeight], child) => traverse(child, currJoints, currWeight),
      [numJoints + 1, total + weight(joint)]
    )

  const [numJoints, totalWeight] = traverse(joint, 0, 0)
  return totalWeight / numJoints > 0.5 ? BonePrimaryAxis.Y : BonePrimaryAxis.X
}

export const createArmature = (joint: Joint, bonePrimaryAxis?: BonePrimaryAxis) => {
  const primaryAxis = bonePrimaryAxis || guessBonePrimaryAxis(joint)

  const createBone = (joint: Joint) => {
    const bone = new THREE.Bone()
    bone.name = joint.name
    bone.matrix.copy(joint.localTransform)
    bone.matrixAutoUpdate = false

    const geometry = createBoneGeometry(guessBoneLength(joint), primaryAxis)
    bone.add(new THREE.Mesh(geometry, boneMaterial))

    for (const child of joint.children) {
      bone.add(createBone(child))
    }
    return bone
  }

  return createBone(joint)
}
