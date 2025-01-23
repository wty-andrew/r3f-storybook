import { type MeshProps, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import type * as THREE from 'three'

const Box = (props: MeshProps) => {
  const ref = useRef<THREE.Mesh>(null!)
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  useFrame((_state, delta) => {
    ref.current.rotation.x += delta
  })

  return (
    <mesh
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(_event) => click(!clicked)}
      onPointerOver={(event) => {
        event.stopPropagation()
        hover(true)
      }}
      onPointerOut={(_event) => hover(false)}
      {...props}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

export default Box
