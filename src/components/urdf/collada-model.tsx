import { type GroupProps, useLoader } from '@react-three/fiber'
import { useMemo } from 'react'
import {
  type Collada,
  ColladaLoader,
} from 'three/examples/jsm/loaders/ColladaLoader.js'

interface ColladaModelProps extends GroupProps {
  url: string
}

const ColladaModel = ({ url, ...props }: ColladaModelProps) => {
  const collada: Collada = useLoader(ColladaLoader, url)
  const scene = useMemo(() => collada.scene.clone(), [collada.scene])
  return (
    <group {...props}>
      <primitive object={scene} />
    </group>
  )
}

export default ColladaModel
