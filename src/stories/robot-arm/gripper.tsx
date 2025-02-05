import type { GroupProps } from '@react-three/fiber'
import { forwardRef } from 'react'
import * as THREE from 'three'

import { ColladaModel, Joint, Link } from '@/components/urdf'
import { resolve } from '@/config'
import type { JointSchema } from '@/types'

export const jointSchema: Record<string, JointSchema> = {
  robotiq_85_base_joint: {
    type: 'fixed',
  },
  robotiq_85_left_knuckle_joint: {
    type: 'revolute',
    axis: new THREE.Vector3(0, -1, 0),
    offset: new THREE.Quaternion(0, 0, 0, 1),
    lower: 0,
    upper: 0.8,
  },
  robotiq_85_right_knuckle_joint: {
    type: 'revolute',
    axis: new THREE.Vector3(0, -1, 0),
    offset: new THREE.Quaternion(0, 0, 0, 1),
    lower: -0.8,
    upper: 0,
  },
  robotiq_85_left_finger_joint: {
    type: 'fixed',
  },
  robotiq_85_right_finger_joint: {
    type: 'fixed',
  },
  robotiq_85_left_inner_knuckle_joint: {
    type: 'continuous',
    axis: new THREE.Vector3(0, -1, 0),
    offset: new THREE.Quaternion(0, 0, 0, 1),
  },
  robotiq_85_right_inner_knuckle_joint: {
    type: 'continuous',
    axis: new THREE.Vector3(0, -1, 0),
    offset: new THREE.Quaternion(0, 0, 0, 1),
  },
  robotiq_85_left_finger_tip_joint: {
    type: 'continuous',
    axis: new THREE.Vector3(0, -1, 0),
    offset: new THREE.Quaternion(0, 0, 0, 1),
  },
  robotiq_85_right_finger_tip_joint: {
    type: 'continuous',
    axis: new THREE.Vector3(0, -1, 0),
    offset: new THREE.Quaternion(0, 0, 0, 1),
  },
}

const Gripper = forwardRef<THREE.Group, GroupProps>(({ children, ...props }, ref) => (
  <group ref={ref} name="robotiq_gripper" {...props}>
    <Joint
      name="robotiq_85_base_joint"
      position={[0, 0, 0.0135]}
      rotation={[0, 0, Math.PI, 'ZYX']}
    >
      <group position={[0, 0, 0.12]}>{children}</group>
      <Link name="robotiq_85_base_link">
        <ColladaModel
          url={resolve('/meshes/robotiq_gripper/visual/robotiq_base.dae')}
        />
        <Joint
          name="robotiq_85_left_knuckle_joint"
          position={[0.03060114, 0, 0.05490452]}
          rotation={[0, 0, 0, 'ZYX']}
        >
          <Link name="robotiq_85_left_knuckle_link">
            <ColladaModel
              url={resolve('/meshes/robotiq_gripper/visual/left_knuckle.dae')}
            />
            <Joint
              name="robotiq_85_left_finger_joint"
              position={[0.03152616, 0, -0.00376347]}
              rotation={[0, 0, 0, 'ZYX']}
            >
              <Link name="robotiq_85_left_finger_link">
                <ColladaModel
                  url={resolve('/meshes/robotiq_gripper/visual/left_finger.dae')}
                />
                <Joint
                  name="robotiq_85_left_finger_tip_joint"
                  position={[0.00563134, 0, 0.04718515]}
                  rotation={[0, 0, 0, 'ZYX']}
                >
                  <Link name="robotiq_85_left_finger_tip_link">
                    <ColladaModel
                      url={resolve(
                        '/meshes/robotiq_gripper/visual/left_finger_tip.dae'
                      )}
                    />
                  </Link>
                </Joint>
              </Link>
            </Joint>
          </Link>
        </Joint>
        <Joint
          name="robotiq_85_right_knuckle_joint"
          position={[-0.03060114, 0, 0.05490452]}
          rotation={[0, 0, 0, 'ZYX']}
        >
          <Link name="robotiq_85_right_knuckle_link">
            <ColladaModel
              url={resolve('/meshes/robotiq_gripper/visual/right_knuckle.dae')}
            />
            <Joint
              name="robotiq_85_right_finger_joint"
              position={[-0.03152616, 0, -0.00376347]}
              rotation={[0, 0, 0, 'ZYX']}
            >
              <Link name="robotiq_85_right_finger_link">
                <ColladaModel
                  url={resolve('/meshes/robotiq_gripper/visual/right_finger.dae')}
                />
                <Joint
                  name="robotiq_85_right_finger_tip_joint"
                  position={[-0.00563134, 0, 0.04718515]}
                  rotation={[0, 0, 0, 'ZYX']}
                >
                  <Link name="robotiq_85_right_finger_tip_link">
                    <ColladaModel
                      url={resolve(
                        '/meshes/robotiq_gripper/visual/right_finger_tip.dae'
                      )}
                    />
                  </Link>
                </Joint>
              </Link>
            </Joint>
          </Link>
        </Joint>
        <Joint
          name="robotiq_85_left_inner_knuckle_joint"
          position={[0.0127, 0, 0.06142]}
          rotation={[0, 0, 0, 'ZYX']}
        >
          <Link name="robotiq_85_left_inner_knuckle_link">
            <ColladaModel
              url={resolve('/meshes/robotiq_gripper/visual/left_inner_knuckle.dae')}
            />
          </Link>
        </Joint>
        <Joint
          name="robotiq_85_right_inner_knuckle_joint"
          position={[-0.0127, 0, 0.06142]}
          rotation={[0, 0, 0, 'ZYX']}
        >
          <Link name="robotiq_85_right_inner_knuckle_link">
            <ColladaModel
              url={resolve('/meshes/robotiq_gripper/visual/right_inner_knuckle.dae')}
            />
          </Link>
        </Joint>
      </Link>
    </Joint>
  </group>
))

export default Gripper
