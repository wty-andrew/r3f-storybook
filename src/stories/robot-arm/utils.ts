import * as THREE from 'three'

export const setOpacity = (
  object: THREE.Object3D,
  opacity: number,
  predicate: (mesh: THREE.Mesh) => boolean = () => true
) => {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh && predicate(child)) {
      if (Array.isArray(child.material)) {
        for (const material of child.material) {
          material.opacity = opacity
          material.transparent = true
        }
      } else {
        child.material.opacity = opacity
        child.material.transparent = true
      }
    }
  })
}
