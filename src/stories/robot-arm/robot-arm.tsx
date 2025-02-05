import type { GroupProps } from '@react-three/fiber'
import { forwardRef } from 'react'
import * as THREE from 'three'

import { ColladaModel, Joint, Link } from '@/components/urdf'
import { resolve } from '@/config'
import type { JointSchema } from '@/types'

export const jointSchema: Record<string, JointSchema> = {
  link0_to_link1: {
    type: 'revolute',
    axis: new THREE.Vector3(0, 0, 1),
    offset: new THREE.Quaternion(0, 0, 0, 1),
    lower: -2.96706,
    upper: 2.96706,
  },
  link1_to_link2: {
    type: 'revolute',
    axis: new THREE.Vector3(0, 1, 0),
    offset: new THREE.Quaternion(0, 0, 0, 1),
    lower: -2.094395,
    upper: 2.094395,
  },
  link2_to_link3: {
    type: 'revolute',
    axis: new THREE.Vector3(0, 0, 1),
    offset: new THREE.Quaternion(0, 0, 0, 1),
    lower: -2.96706,
    upper: 2.96706,
  },
  link3_to_link4: {
    type: 'revolute',
    axis: new THREE.Vector3(0, -1, 0),
    offset: new THREE.Quaternion(0, 0, 0, 1),
    lower: -2.094395,
    upper: 2.094395,
  },
  link4_to_link5: {
    type: 'revolute',
    axis: new THREE.Vector3(0, 0, 1),
    offset: new THREE.Quaternion(0, 0, 0, 1),
    lower: -2.96706,
    upper: 2.96706,
  },
  link5_to_link6: {
    type: 'revolute',
    axis: new THREE.Vector3(0, 1, 0),
    offset: new THREE.Quaternion(0, 0, 0, 1),
    lower: -2.094395,
    upper: 2.094395,
  },
  link6_to_link7: {
    type: 'revolute',
    axis: new THREE.Vector3(0, 0, 1),
    offset: new THREE.Quaternion(0, 0, 0, 1),
    lower: -3.054326,
    upper: 3.054326,
  },
  link7_to_link_ee: {
    type: 'fixed',
  },
}

const RobotArm = forwardRef<THREE.Group, GroupProps>(({ children, ...props }, ref) => (
  <group ref={ref} name="iiwa7" {...props}>
    <Link name="link0">
      <ColladaModel
        url={resolve('/meshes/iiwa7/visual/link_0.dae')}
        position={[0, 0, 0]}
        rotation={[0, 0, 0, 'ZYX']}
      />
      <Joint
        name="link0_to_link1"
        position={[0, 0, 0.1475]}
        rotation={[0, 0, 0, 'ZYX']}
      >
        <Link name="link1">
          <ColladaModel
            url={resolve('/meshes/iiwa7/visual/link_1.dae')}
            position={[0, 0, -0.1475]}
            rotation={[0, 0, 0, 'ZYX']}
          />
          <Joint
            name="link1_to_link2"
            position={[0, -0.0105, 0.1925]}
            rotation={[0, 0, 0, 'ZYX']}
          >
            <Link name="link2">
              <ColladaModel
                url={resolve('/meshes/iiwa7/visual/link_2.dae')}
                position={[0, 0.0105, -0.34]}
                rotation={[0, 0, 0, 'ZYX']}
              />
              <Joint
                name="link2_to_link3"
                position={[0, 0.0105, 0.2075]}
                rotation={[0, 0, 0, 'ZYX']}
              >
                <Link name="link3">
                  <ColladaModel
                    url={resolve('/meshes/iiwa7/visual/link_3.dae')}
                    position={[0, 0, -0.5475]}
                    rotation={[0, 0, 0, 'ZYX']}
                  />
                  <Joint
                    name="link3_to_link4"
                    position={[0, 0.0105, 0.1925]}
                    rotation={[0, 0, 0, 'ZYX']}
                  >
                    <Link name="link4">
                      <ColladaModel
                        url={resolve('/meshes/iiwa7/visual/link_4.dae')}
                        position={[0, -0.0105, -0.74]}
                        rotation={[0, 0, 0, 'ZYX']}
                      />
                      <Joint
                        name="link4_to_link5"
                        position={[0, -0.0105, 0.2075]}
                        rotation={[0, 0, 0, 'ZYX']}
                      >
                        <Link name="link5">
                          <ColladaModel
                            url={resolve('/meshes/iiwa7/visual/link_5.dae')}
                            position={[0, 0, -0.9475]}
                            rotation={[0, 0, 0, 'ZYX']}
                          />
                          <Joint
                            name="link5_to_link6"
                            position={[0, -0.0707, 0.1925]}
                            rotation={[0, 0, 0, 'ZYX']}
                          >
                            <Link name="link6">
                              <ColladaModel
                                url={resolve('/meshes/iiwa7/visual/link_6.dae')}
                                position={[0, 0.0707, -1.14]}
                                rotation={[0, 0, 0, 'ZYX']}
                              />
                              <Joint
                                name="link6_to_link7"
                                position={[0, 0.0707, 0.091]}
                                rotation={[0, 0, 0, 'ZYX']}
                              >
                                <Link name="link7">
                                  <ColladaModel
                                    url={resolve('/meshes/iiwa7/visual/link_7.dae')}
                                    position={[0, 0, -1.231]}
                                    rotation={[0, 0, 0, 'ZYX']}
                                  />
                                  <Joint
                                    name="link7_to_link_ee"
                                    position={[0, 0, 0.035]}
                                    rotation={[0, 0, 0, 'ZYX']}
                                  >
                                    <Link name="link_ee">{children}</Link>
                                  </Joint>
                                </Link>
                              </Joint>
                            </Link>
                          </Joint>
                        </Link>
                      </Joint>
                    </Link>
                  </Joint>
                </Link>
              </Joint>
            </Link>
          </Joint>
        </Link>
      </Joint>
    </Link>
  </group>
))

export default RobotArm
