import * as THREE from 'three'

import type { Track, Interpolation, Transform } from './types'

// TODO:
export class TransformTrack {
  translation?: Track<THREE.Vector3>
  rotation?: Track<THREE.Quaternion>
  scale?: Track<THREE.Vector3>

  get maxFrame() {
    return Math.max(
      this.translation?.frames.length || 0,
      this.rotation?.frames.length || 0,
      this.scale?.frames.length || 0
    )
  }

  setTranslationTrack(
    timestamps: number[],
    values: number[],
    interpolation?: Interpolation
  ) {
    this.translation = {
      frames: timestamps.map((time, index) => ({
        time,
        value: new THREE.Vector3().fromArray(values, index * 3),
      })),
      interpolation,
    }
    return this
  }

  setRotationTrack(
    timestamps: number[],
    values: number[],
    interpolation?: Interpolation
  ) {
    this.rotation = {
      frames: timestamps.map((time, index) => ({
        time,
        value: new THREE.Quaternion().fromArray(values, index * 4),
      })),
      interpolation,
    }
    return this
  }

  setScaleTrack(timestamps: number[], values: number[], interpolation?: Interpolation) {
    this.scale = {
      frames: timestamps.map((time, index) => ({
        time,
        value: new THREE.Vector3().fromArray(values, index * 3),
      })),
      interpolation,
    }
    return this
  }

  sample(transform: Transform, time: number) {
    // TODO:
  }

  // this assumes the TRS tracks have the same timestamps
  sampleByIndex(transform: Transform, index: number) {
    const translation = this.translation?.frames[index]?.value
    translation && transform.translation.copy(translation)
    const rotation = this.rotation?.frames[index]?.value
    rotation && transform.rotation.copy(rotation)
    const scale = this.scale?.frames[index]?.value
    scale && transform.scale.copy(scale)
    return transform
  }
}
