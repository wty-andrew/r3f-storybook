import type { GroupProps } from '@react-three/fiber'
import { forwardRef } from 'react'
import type * as THREE from 'three'

export interface JointProps extends GroupProps {
  name: string
}

const Joint = forwardRef<THREE.Group, JointProps>(
  ({ name, children, ...props }, ref) => (
    <group ref={ref} name={name} {...props}>
      {children}
    </group>
  )
)

export default Joint
