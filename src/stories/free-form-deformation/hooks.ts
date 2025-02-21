import { folder, useControls } from 'leva'
import { useMemo } from 'react'
import shortid from 'shortid'
import * as THREE from 'three'

import { useCreateStore } from '@/leva'
import FFD, { ParametricCoordinate, type ControlPoints } from './ffd'
import type { LatticePoint } from './lattice-modifier'

const DEFAULT_LATTICE_DIMENSION = 2
const MAX_LATTICE_DIMENSION = 4

enum Shape {
  Sphere = 'Sphere',
  Box = 'Box',
  Torus = 'Torus',
}

const createGeometry = (shape: Shape) => {
  switch (shape) {
    case Shape.Sphere:
      return new THREE.SphereGeometry(1, 64, 64)
    case Shape.Box:
      return new THREE.BoxGeometry(2, 2, 2, 16, 16, 16)
    case Shape.Torus:
      return new THREE.TorusGeometry(1, 0.4, 24, 96)
  }
}

export const useSettings = () => {
  const store = useCreateStore()

  const slider = {
    value: DEFAULT_LATTICE_DIMENSION,
    min: 1,
    max: MAX_LATTICE_DIMENSION,
    step: 1,
  }

  return useControls(
    {
      shape: {
        options: Object.values(Shape),
        value: Shape.Sphere,
      },
      Dimension: folder({ l: slider, m: slider, n: slider }),
    },
    { store }
  )
}

export const useSurfaceLatticePoints = (controlPoints: ControlPoints) =>
  useMemo(() => {
    const latticePoints: LatticePoint[] = []
    const { l, m, n } = controlPoints
    for (const [point, i, j, k] of controlPoints) {
      if (i === 0 || i === l || j === 0 || j === m || k === 0 || k === n) {
        latticePoints.push({
          id: shortid.generate(),
          ref: point,
          position: point.toArray() as [number, number, number],
        })
      }
    }
    return latticePoints
  }, [controlPoints])

export const useFFD = (shape: Shape, l: number, m: number, n: number) =>
  useMemo(() => {
    const geometry = createGeometry(shape)
    const position = geometry.getAttribute('position') as THREE.BufferAttribute

    const coord = ParametricCoordinate.fromBbox(
      new THREE.Box3().setFromBufferAttribute(position),
      0.05 // add padding to prevent numerical issue (points at the edge), better fix the shader
    )
    const ffd = new FFD(geometry, coord, l, m, n)
    geometry.setAttribute('parametricPosition', ffd.position)

    return ffd
  }, [shape, l, m, n])
