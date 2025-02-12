import { useGLTF } from '@react-three/drei'
import { useControls } from 'leva'
import { useEffect, useRef, useState } from 'react'
import { suspend } from 'suspend-react'
import * as THREE from 'three'

import { createArmature } from './armature'
import Fox, { MODEL_PATH } from './fox'
import { loadAnimations, loadSkeleton } from './gltf-parser'
import { useAnimationMixer } from './hooks'
import type { TransformTrack } from './track'
import Transform from './transform'

// similar to THREE.AnimationClip { name: string, tracks: KeyframeTrack[] }
type AnimationClip = Record<string, TransformTrack>

const useSettings = (animations: Record<string, AnimationClip>) => {
  const options = Object.keys(animations)
  const { animation } = useControls({
    animation: {
      options,
      value: options[0] || '',
    },
  })

  const [{ frame }, setFrame] = useControls(() => {
    return {
      frame: {
        value: 0,
        min: 0,
        max: Object.values(animations[animation])[0].maxFrame - 1,
        step: 1,
      },
    }
  }, [animation])

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => setFrame({ frame: 0 }), [animation])
  return { animation, frame }
}

const useCustomGLTF = (url: string) => {
  const { parser, animations: threeAnimations } = useGLTF(url)

  return suspend(async () => {
    const skeleton = await loadSkeleton(parser)
    const animations = await loadAnimations(parser)
    return { animations, skeleton, threeAnimations }
  }, [])
}

const _matrix4 = new THREE.Matrix4()
const _transform = new Transform()

const getTimeByFrameIndex = (transformTrack: TransformTrack, index: number) => {
  const { translation, rotation, scale } = transformTrack
  const anyTrack = translation || rotation || scale
  return anyTrack?.frames[index]?.time
}

const applyTransform = (clip: AnimationClip, frame: number, bone: THREE.Bone) => {
  // we can use bone.matrix instead of joint.localTransform here because any missing TRS
  // track will have their corresponding component in bone.matrix unchanged
  _transform.setFromMatrix4(bone.matrix)
  clip[bone.name]?.sampleByIndex(_transform, frame)
  bone.matrix.copy(_transform.toMatrix4(_matrix4))
  for (const child of bone.children) {
    child instanceof THREE.Bone && applyTransform(clip, frame, child)
  }
}

const Scene = () => {
  const modelRef = useRef<THREE.Group>(null!)
  const { skeleton, animations, threeAnimations } = useCustomGLTF(MODEL_PATH)
  const [armature] = useState(() => createArmature(skeleton.joints[0]))
  const mixer = useAnimationMixer(modelRef)
  const { animation, frame } = useSettings(animations)

  // Animate skinned mesh with THREE.AnimationMixer
  useEffect(() => {
    const clip = THREE.AnimationClip.findByName(threeAnimations, animation)
    if (!clip) return

    const action = mixer.clipAction(clip)
    action.play()
    const transformTrack = Object.values(animations[animation])[0]
    // assume the timestamps are the same for all tracks in the clip
    const timestamp = getTimeByFrameIndex(transformTrack, frame) || 0
    mixer.update(timestamp)
    return () => void action.stop()
  }, [animations, animation, frame, mixer, threeAnimations])

  // Animate armature with custom animation system
  useEffect(() => {
    applyTransform(animations[animation], frame, armature)
  }, [animations, animation, frame, armature])

  return (
    <group scale={[0.01, 0.01, 0.01]}>
      <Fox ref={modelRef} />

      <primitive object={armature} />
    </group>
  )
}

export default Scene
