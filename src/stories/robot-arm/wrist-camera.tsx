import type { GroupProps } from '@react-three/fiber'
import { forwardRef } from 'react'
import type * as THREE from 'three'

import { ColladaModel, Joint, Link } from '@/components/urdf'
import { resolve } from '@/config'
import type { JointSchema } from '@/types'

export const jointSchema: Record<string, JointSchema> = {
  wrist_camera_base_joint: {
    type: 'fixed',
  },
}

interface WristCameraProps extends GroupProps {
  camera?: React.ReactNode
}

const WristCamera = forwardRef<THREE.Group, WristCameraProps>(
  ({ children, camera, ...props }, ref) => (
    <group ref={ref} name="robotiq_wrist_camera" {...props}>
      <Joint
        name="wrist_camera_base_joint"
        position={[0, 0, 0]}
        rotation={[0, 0, 0, 'ZYX']}
      >
        <Link name="wrist_camera_base_link">
          <ColladaModel
            url={resolve('/meshes/robotiq_wrist_camera/visual/wrist_camera.dae')}
          />
          <Joint
            name="camera_mount_joint"
            position={[0, 0.04255, 0.0107]}
            rotation={[-1.5707963267948966, -1.5707963267948966, 0, 'ZYX']}
          >
            <Link name="wrist_camera_mount_link">
              <Joint
                name="camera_joint"
                position={[0, 0, 0]}
                rotation={[0, -0.5235987755982988, 0, 'ZYX']}
              >
                <Link name="wrist_camera_link">
                  <Joint
                    name="camera_optical_joint"
                    position={[0, 0, 0]}
                    rotation={[-1.5707963267948966, 0, -1.5707963267948966, 'ZYX']}
                  >
                    <Link name="wrist_camera_link_optical" />
                    {camera}
                  </Joint>
                </Link>
              </Joint>
            </Link>
          </Joint>
          {children}
        </Link>
      </Joint>
    </group>
  )
)

export default WristCamera
