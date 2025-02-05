import * as THREE from 'three'
import { MathUtils } from 'three'

export const { clamp, radToDeg, degToRad } = MathUtils

const EPSILON = 1e-6

const _project = new THREE.Vector3()

// https://stackoverflow.com/questions/3684269/component-of-a-quaternion-rotation-around-an-axis
export const swingTwistDecomposition = (
  rotation: THREE.Quaternion,
  twistAxis: THREE.Vector3,
  outSwing: THREE.Quaternion,
  outTwist: THREE.Quaternion
) => {
  // TODO: handle singularity
  const { x, y, z, w } = rotation
  _project.set(x, y, z).projectOnVector(twistAxis)
  outTwist.set(_project.x, _project.y, _project.z, w).normalize()
  outSwing.copy(outTwist).conjugate().premultiply(rotation)
}

// https://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm
export const getAxisAngle = (q: THREE.Quaternion, outAxis: THREE.Vector3) => {
  const angle = 2 * Math.acos(q.w)
  const s = Math.sqrt(1 - q.w * q.w)
  if (s < EPSILON) {
    outAxis.set(1, 0, 0) // sigularity when angle = 0, axis can be arbitrary
  } else {
    outAxis.set(q.x / s, q.y / s, q.z / s)
  }
  return angle
}
