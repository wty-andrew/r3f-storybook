import type * as THREE from 'three'

export type JointSchema =
  | {
      type: 'fixed' | 'floating' | 'planar'
    }
  | {
      type: 'continuous'
      axis: THREE.Vector3
      offset: THREE.Quaternion
    }
  | {
      type: 'revolute'
      axis: THREE.Vector3
      offset: THREE.Quaternion
      lower: number
      upper: number
    }
  | {
      type: 'prismatic'
      axis: THREE.Vector3
      offset: THREE.Vector3
      lower: number
      upper: number
    }
