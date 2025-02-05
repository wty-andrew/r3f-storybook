import type { GroupProps } from '@react-three/fiber'

export interface LinkProps extends Omit<GroupProps, 'position' | 'rotation'> {
  name: string
}

const Link = ({ name, ...props }: LinkProps) => <group name={name} {...props} />

export default Link
