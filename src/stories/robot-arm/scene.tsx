import { Grid, PivotControls, Sphere } from '@react-three/drei'
import { button, folder, useControls } from 'leva'
import { useCallback, useLayoutEffect, useRef } from 'react'
import type * as THREE from 'three'

import type { JointSchema } from '@/types'
import Gripper, { jointSchema as gripperJointSchema } from './gripper'
import RobotArm, { jointSchema as armJointSchema } from './robot-arm'
import useJointControl from './use-joint-control'
import { setOpacity } from './utils'
import VirtualCamera from './virtual-camera'
import WristCamera, { jointSchema as wristCameraJointSchema } from './wrist-camera'
import IKSolver from './ik-solver'

const DEFAULT_POSE: Record<string, number> = {
  link0_to_link1: 0,
  link1_to_link2: Math.PI / 4,
  link2_to_link3: 0,
  link3_to_link4: -Math.PI / 2,
  link4_to_link5: 0,
  link5_to_link6: Math.PI / 4,
  link6_to_link7: 0,
}

const JOINT_SCHEMA: Record<string, JointSchema> = {
  ...armJointSchema,
  wrist_camera_base_joint: wristCameraJointSchema.wrist_camera_base_joint,
  robotiq_85_base_joint: gripperJointSchema.robotiq_85_base_joint,
  tcp: { type: 'fixed' },
}

const Scene = () => {
  const robotRef = useRef<THREE.Group>(null!)
  const tcpRef = useRef<THREE.Group>(null!)
  const pivotControlRef = useRef<THREE.Group>(null!)
  const targetRef = useRef<THREE.Mesh>(null!)
  const ikSolverRef = useRef<IKSolver>()

  useLayoutEffect(() => {
    setOpacity(robotRef.current, 0.9, (mesh) => mesh.name.startsWith('link_'))
    ikSolverRef.current = new IKSolver(robotRef.current, JOINT_SCHEMA)
  }, [])

  const setJointValues = useJointControl(robotRef, JOINT_SCHEMA)

  const resetTarget = useCallback(() => {
    tcpRef.current.updateWorldMatrix(true, false)
    pivotControlRef.current.matrix.copy(tcpRef.current.matrixWorld)
  }, [])

  useLayoutEffect(() => {
    setJointValues(DEFAULT_POSE)
    resetTarget()
  }, [setJointValues, resetTarget])

  const solve = useCallback(
    (maxIterations = 1, positionTolerance = 1e-2) =>
      ikSolverRef.current?.solve(targetRef.current, maxIterations, positionTolerance),
    []
  )

  const { showCameraHelper, liveUpdate } = useControls({
    showCameraHelper: {
      label: 'Show Camera Helper',
      value: false,
    },
    IK: folder({
      liveUpdate: {
        label: 'Live Update',
        value: true,
      },
      'Reset Target': button(resetTarget),
      Step: button(() => solve(1)),
    }),
  })

  return (
    <>
      <RobotArm ref={robotRef} rotation={[-Math.PI / 2, 0, 0]}>
        <WristCamera
          camera={
            <VirtualCamera
              rotation={[Math.PI, 0, 0]}
              showHelper={showCameraHelper}
              x={20}
              y={20}
              width={200}
              aspect={4 / 3}
              near={0.07}
              far={0.65}
              fov={39}
            />
          }
        >
          <Gripper>
            <group ref={tcpRef} name="tcp" />
          </Gripper>
        </WristCamera>
      </RobotArm>

      <PivotControls
        ref={pivotControlRef}
        rotation={[0, 0, Math.PI]}
        onDrag={() => liveUpdate && solve(10)}
        disableScaling={true}
        scale={0.1}
        lineWidth={2}
      >
        <Sphere ref={targetRef} args={[0.02]} material-color="yellow" />
      </PivotControls>

      <Grid cellSize={0.1} infiniteGrid fadeDistance={5} />
    </>
  )
}

export default Scene
