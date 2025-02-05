import * as THREE from 'three'

import { clamp, getAxisAngle, swingTwistDecomposition } from '@/math'
import type { JointSchema } from '@/types'

const _targetPos = new THREE.Vector3()
const _tcpPos = new THREE.Vector3()
const _jointToTarget = new THREE.Vector3()
const _jointToTcp = new THREE.Vector3()
const _jointPos = new THREE.Vector3()
const _jointRot = new THREE.Quaternion()
const _jointScale = new THREE.Vector3() // not used
const _rotation = new THREE.Quaternion()
const _offsetInv = new THREE.Quaternion()
const _axis = new THREE.Vector3()

const _swing = new THREE.Quaternion() // not used
const _twist = new THREE.Quaternion()

export type IKJoint = JointSchema & { name: string; joint: THREE.Object3D }

// only works with revolute joints
export const solveIK = (
  joints: IKJoint[],
  target: THREE.Object3D,
  maxIterations: number,
  positionTolerance: number
) => {
  const tcp = joints[joints.length - 1].joint
  _targetPos.setFromMatrixPosition(target.matrixWorld)

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    for (let i = joints.length - 2; i >= 0; i--) {
      const ikJoint = joints[i]
      if (ikJoint.type !== 'revolute') continue
      const { joint, axis, offset, lower, upper } = ikJoint

      // rotate tcp towards target in local coordinates
      joint.matrixWorld.decompose(_jointPos, _jointRot, _jointScale)
      _jointRot.invert()

      _tcpPos.setFromMatrixPosition(tcp.matrixWorld)
      _jointToTcp.subVectors(_tcpPos, _jointPos).applyQuaternion(_jointRot).normalize()

      _jointToTarget
        .subVectors(_targetPos, _jointPos)
        .applyQuaternion(_jointRot)
        .normalize()

      _rotation.setFromUnitVectors(_jointToTcp, _jointToTarget)

      // constrain the rotation on the joint axis
      swingTwistDecomposition(_rotation, axis, _swing, _twist)
      _jointRot.copy(joint.quaternion).multiply(_twist)

      // constrain the rotation on joint limits
      _offsetInv.copy(offset).invert()
      _jointRot.multiply(_offsetInv)
      const angle = getAxisAngle(_jointRot, _axis)
      const sign = Math.sign(_axis.dot(axis))

      joint.quaternion
        .setFromAxisAngle(axis, clamp(sign * angle, lower, upper))
        .premultiply(offset)

      joint.updateMatrixWorld(true)
    }

    _tcpPos.setFromMatrixPosition(tcp.matrixWorld)
    if (_tcpPos.distanceTo(_targetPos) < positionTolerance) {
      break
    }
  }
}
