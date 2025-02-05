import { PerspectiveCamera, useHelper } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { type ComponentProps, useEffect, useRef } from 'react'
import * as THREE from 'three'

interface VirtualCameraProps extends ComponentProps<typeof PerspectiveCamera> {
  x: number
  y: number
  width: number
  aspect: number
  showHelper?: boolean
}

const VirtualCamera = ({
  x,
  y,
  width,
  aspect,
  showHelper = false,
  ...props
}: VirtualCameraProps) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!)

  const helper = useHelper(cameraRef, THREE.CameraHelper)
  useEffect(() => {
    if (helper.current) {
      helper.current.visible = showHelper
    }
  }, [helper, showHelper])

  useFrame(({ gl, scene, size, camera }) => {
    const { current: wristCamera } = cameraRef
    wristCamera.aspect = aspect // make sure aspect doesn't change when resize
    wristCamera.updateProjectionMatrix()

    gl.setViewport(0, 0, size.width, size.height)
    gl.render(scene, camera)

    const height = width / aspect
    gl.setViewport(x, y, width, height)
    gl.setScissor(x, y, width, height)
    gl.setScissorTest(true)
    // TODO: disable visibility of other objects
    const helperVisible = helper.current?.visible ?? false
    if (helper.current) {
      helper.current.visible = false
    }
    gl.render(scene, wristCamera)
    // TODO: enable visibility of other objects
    if (helper.current) {
      helper.current.visible = helperVisible
    }
    gl.setScissorTest(false)
    gl.setViewport(0, 0, size.width, size.height)
  }, 1)

  return <PerspectiveCamera ref={cameraRef} aspect={aspect} {...props} />
}

export default VirtualCamera
