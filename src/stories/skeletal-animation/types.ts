import type * as THREE from 'three'

export interface Joint {
  name: string
  parent: Joint | null
  children: Joint[]
  localTransform: THREE.Matrix4
  inverseBindTransform: THREE.Matrix4
}

export interface Skeleton {
  joints: Joint[]
}

export interface Frame<T> {
  time: number
  value: T
  inputTangent?: T
  outputTangent?: T
}

export type ScalarFrame = Frame<number>
export type VectorFrame = Frame<THREE.Vector3>
export type QuaternionFrame = Frame<THREE.Quaternion>

export interface Track<T> {
  frames: Frame<T>[]
  interpolation?: 'LINEAR' | 'STEP' | 'CUBICSPLINE'
}

export type Interpolation = 'LINEAR' | 'STEP' | 'CUBICSPLINE'

export interface Transform {
  translation: THREE.Vector3
  rotation: THREE.Quaternion
  scale: THREE.Vector3
}
