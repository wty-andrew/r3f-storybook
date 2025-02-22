/*
Minor tweaks after auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import { useGLTF } from '@react-three/drei'
import type { GroupProps } from '@react-three/fiber'
import mergeRefs from 'merge-refs'
import React, { forwardRef } from 'react'
import type * as THREE from 'three'
import type { GLTF } from 'three-stdlib'

import { resolve } from '@/config'

export const MODEL_PATH = resolve('/models/Fox/Fox.glb')

type ActionName = 'Survey' | 'Walk' | 'Run'

interface GLTFAction extends THREE.AnimationClip {
  name: ActionName
}

type GLTFResult = GLTF & {
  nodes: {
    fox: THREE.SkinnedMesh
    _rootJoint: THREE.Bone
  }
  materials: {
    fox_material: THREE.MeshStandardMaterial
  }
  animations: GLTFAction[]
}

const Model = forwardRef<THREE.Group, GroupProps>((props, ref) => {
  const group = React.useRef<THREE.Group>(null!)
  const { nodes, materials } = useGLTF(MODEL_PATH) as GLTFResult
  return (
    <group ref={mergeRefs(ref, group)} {...props} dispose={null}>
      <group>
        <group name="root">
          <primitive object={nodes._rootJoint} />
          <skinnedMesh
            name="fox"
            geometry={nodes.fox.geometry}
            material={materials.fox_material}
            skeleton={nodes.fox.skeleton}
          />
        </group>
      </group>
    </group>
  )
})

export default Model

useGLTF.preload(MODEL_PATH)
