import { GizmoHelper, GizmoViewport, OrbitControls, Stats } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import type { Meta } from '@storybook/react'

import Leva from '@/leva'
import Scene from './scene'

export const Default = () => (
  <>
    <Canvas camera={{ position: [1, 1, 1] }}>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[10, 10, -10]} decay={0} intensity={Math.PI} />

      <Stats />
      <OrbitControls makeDefault />

      <GizmoHelper alignment="bottom-right">
        <GizmoViewport labelColor="white" />
      </GizmoHelper>

      <Scene />
    </Canvas>

    <Leva />
  </>
)

export default {
  title: 'Skeletal Animation',
  component: Default,
} satisfies Meta<typeof Default>
