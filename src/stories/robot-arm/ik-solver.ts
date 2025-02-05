import { type IKJoint, solveIK } from '@/ik/ccdik'
import * as THREE from 'three'

import type { JointSchema } from '@/types'

class IKSolver {
  joints: IKJoint[]

  constructor(root: THREE.Object3D, schemas: Record<string, JointSchema>) {
    this.joints = []

    const jointNames = new Set(Object.keys(schemas))
    root.traverse((node) => {
      if (node instanceof THREE.Group && jointNames.has(node.name)) {
        this.joints.push({ name: node.name, joint: node, ...schemas[node.name] })
      }
    })
  }

  solve(target: THREE.Object3D, maxIterations: number, positionTolerance: number) {
    solveIK(this.joints, target, maxIterations, positionTolerance)
  }
}

export default IKSolver
