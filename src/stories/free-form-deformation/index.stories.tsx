import { GizmoHelper, GizmoViewport, OrbitControls, Stats } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import type { Meta, StoryObj } from '@storybook/react'
import {
  type FunctionComponent,
  type PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react'

import Leva from '@/leva'
import { DeformMaterial, updateUniforms } from './deform-material'
import { useFFD, useSettings, useSurfaceLatticePoints } from './hooks'
import LatticeModifier, { type LatticeModifierHandle } from './lattice-modifier'

type Story = StoryObj<FunctionComponent>

const Setup = ({ children }: PropsWithChildren) => (
  <>
    <Canvas camera={{ position: [3, 3, 4], zoom: 2 }}>
      <OrbitControls makeDefault />

      <color attach="background" args={['black']} />
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />

      <GizmoHelper alignment="bottom-right">
        <GizmoViewport labelColor="white" />
      </GizmoHelper>

      <Stats />

      {children}
    </Canvas>

    <Leva />
  </>
)

export const DefaultStory: Story = {
  name: 'Default',
  render: () => {
    const latticeRef = useRef<LatticeModifierHandle>(null!)
    const { shape, l, m, n } = useSettings()
    // biome-ignore lint/correctness/useExhaustiveDependencies:
    useEffect(() => latticeRef.current.deselect(), [shape, l, m, n])

    const ffd = useFFD(shape, l, m, n)
    const latticePoints = useSurfaceLatticePoints(ffd.controlPoints)

    return (
      <>
        <mesh geometry={ffd.geometry}>
          <meshStandardMaterial wireframe />
        </mesh>

        <LatticeModifier
          ref={latticeRef}
          points={latticePoints}
          onDrag={() => ffd.deform()}
        />
      </>
    )
  },
}

export const ShaderMaterialStory: Story = {
  name: 'Shader Material',
  render: () => {
    const latticeRef = useRef<LatticeModifierHandle>(null!)
    const { shape, l, m, n } = useSettings()
    // biome-ignore lint/correctness/useExhaustiveDependencies:
    useEffect(() => latticeRef.current.deselect(), [shape, l, m, n])

    const ffd = useFFD(shape, l, m, n)
    const latticePoints = useSurfaceLatticePoints(ffd.controlPoints)

    const [deformMaterial] = useState(() => new DeformMaterial())
    useFrame(() => {
      updateUniforms(deformMaterial, ffd.controlPoints.points, l, m, n)
    })

    return (
      <>
        <mesh geometry={ffd.geometry} material={deformMaterial} />

        <LatticeModifier ref={latticeRef} points={latticePoints} />
      </>
    )
  },
}

export default {
  title: 'Free-Form Deformation',
  decorators: [
    (Story) => (
      <Setup>
        <Story />
      </Setup>
    ),
  ],
} satisfies Meta<FunctionComponent>
