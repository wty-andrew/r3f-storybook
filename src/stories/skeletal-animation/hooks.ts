import { type MutableRefObject, useLayoutEffect, useState } from 'react'
import * as THREE from 'three'

export const useAnimationMixer = (ref: MutableRefObject<THREE.Group>) => {
  const [mixer] = useState(
    () => new THREE.AnimationMixer(undefined as unknown as THREE.Object3D)
  )
  useLayoutEffect(() => {
    // biome-ignore lint/suspicious/noExplicitAny:
    ;(mixer as any)._root = ref.current
  })
  return mixer
}
