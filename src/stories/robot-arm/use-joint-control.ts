import * as R from 'rambda'
import { type MutableRefObject, useCallback, useLayoutEffect, useRef } from 'react'
import type * as THREE from 'three'

import { clamp } from '@/math'
import type { JointSchema } from '@/types'
import { noop } from '@/utils'

const jointValueSetter = (
  joint: THREE.Object3D,
  schema: JointSchema
): ((value: number) => void) => {
  switch (schema.type) {
    case 'continuous': {
      const { axis, offset } = schema
      return (value) =>
        joint.quaternion.setFromAxisAngle(axis, value).premultiply(offset)
    }
    case 'revolute': {
      const { axis, offset, lower, upper } = schema
      return (value) =>
        joint.quaternion
          .setFromAxisAngle(axis, clamp(value, lower, upper))
          .premultiply(offset)
    }
    case 'prismatic': {
      const { axis, offset, lower, upper } = schema
      return (value) =>
        joint.position
          .copy(axis)
          .multiplyScalar(clamp(value, lower, upper))
          .add(offset)
    }
    default:
      return noop
  }
}

export const jointsValueSetter = (
  robot: THREE.Object3D,
  schemas: Record<string, JointSchema>
) => {
  const setter = (schema: JointSchema, name: string) => {
    const joint = robot.getObjectByName(name)
    return joint ? jointValueSetter(joint, schema) : noop
  }
  const setJoint = R.map(setter, schemas)
  return (values: Record<string, number>) => {
    for (const [name, value] of Object.entries(values)) {
      setJoint[name]?.(value)
    }
  }
}

const useJointControl = (
  robotRef: MutableRefObject<THREE.Object3D>,
  schemas: Record<string, JointSchema>
) => {
  const setJointValues = useRef<(values: Record<string, number>) => void>(noop)

  useLayoutEffect(() => {
    setJointValues.current = jointsValueSetter(robotRef.current, schemas)
  }, [robotRef, schemas])

  return useCallback(
    (values: Record<string, number>) => setJointValues.current(values),
    []
  )
}

export default useJointControl
