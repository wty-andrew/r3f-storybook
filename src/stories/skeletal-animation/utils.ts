import * as THREE from 'three'

import type { Joint } from './types'

const _identityMatrix4 = new THREE.Matrix4()
const _transform = new THREE.Matrix4()

export const getGlobalTransform = (joint: Joint) => {
  const transform = joint.localTransform.clone()
  let curr = joint.parent
  while (curr) {
    transform.premultiply(curr.localTransform)
    curr = curr.parent
  }
  return transform
}

export const updateInverseBindTransform = (
  joint: Joint,
  parentGlobalTransform = _identityMatrix4
) => {
  const globalTransform = _transform
    .copy(parentGlobalTransform)
    .multiply(joint.localTransform)
  joint.inverseBindTransform.copy(globalTransform).invert()

  for (const child of joint.children) {
    updateInverseBindTransform(child, globalTransform)
  }
}
