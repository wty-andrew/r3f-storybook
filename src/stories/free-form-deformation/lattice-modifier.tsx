import { PivotControls, Sphere } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { forwardRef, useImperativeHandle, useState } from 'react'
import * as THREE from 'three'

export interface LatticePoint {
  id: string
  ref: THREE.Vector3
  position: [number, number, number]
}

export interface LatticeModifierProps {
  points: LatticePoint[]
  onDrag?: () => void
}

export type LatticeModifierHandle = {
  deselect: () => void
}

const LatticeModifier = forwardRef<LatticeModifierHandle, LatticeModifierProps>(
  ({ points, onDrag }, ref) => {
    const [matrix] = useState(() => new THREE.Matrix4())
    const [selected, setSelected] = useState<THREE.Object3D | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    useImperativeHandle(ref, () => ({
      deselect: () => setSelected(null),
    }))

    const handleDrag = (m: THREE.Matrix4) => {
      matrix.copy(m)
      if (!selected) {
        return
      }

      selected.position.setFromMatrixPosition(m)
      selected.rotation.setFromRotationMatrix(m)

      const { index } = selected.userData
      points[index].ref.copy(selected.position)
      onDrag?.()
    }

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
      matrix.copy(e.object.matrixWorld)
      setSelected(e.object)
    }

    return (
      <group
        onPointerMissed={() => {
          if (!isDragging) {
            setSelected(null)
          }
        }}
      >
        <PivotControls
          scale={0.5}
          matrix={matrix}
          visible={selected !== null}
          disableScaling
          disableSliders
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onDrag={handleDrag}
        />

        {points.map(({ id, position }, index) => (
          <Sphere
            key={id}
            args={[0.03]}
            position={position}
            userData={{ index }}
            onClick={handleClick}
          >
            <meshStandardMaterial color="#f37502" />
          </Sphere>
        ))}
      </group>
    )
  }
)

export default LatticeModifier
