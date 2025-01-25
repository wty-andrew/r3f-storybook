import { shaderMaterial } from '@react-three/drei'
import * as R from 'rambda'
import * as THREE from 'three'

import FRAGMENT_SHADER from './shader.frag?raw'
import VERTEX_SHADER from './shader.vert?raw'

const UNIFORMS = {
  u_l: 0,
  u_m: 0,
  u_n: 0,
  // max number of control points = (MAX_LATTICE_DIMENSION + 1) ^ 3
  u_controlPoints: R.range(0, 125).map(() => new THREE.Vector3()),
}

export const DeformMaterial = shaderMaterial(
  UNIFORMS,
  VERTEX_SHADER,
  FRAGMENT_SHADER,
  (material) => {
    material!.wireframe = true
  }
)

export const updateUniforms = (
  material: THREE.ShaderMaterial,
  controlPoints: THREE.Vector3[],
  l: number,
  m: number,
  n: number
) => {
  const u_controlPoints = material.uniforms.u_controlPoints.value as THREE.Vector3[]
  for (let i = 0; i < controlPoints.length; i++) {
    u_controlPoints[i].copy(controlPoints[i])
  }

  material.uniforms.u_l.value = l
  material.uniforms.u_m.value = m
  material.uniforms.u_n.value = n
}
