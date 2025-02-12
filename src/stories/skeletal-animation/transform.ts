import * as THREE from 'three'

class Transform {
  constructor(
    public translation = new THREE.Vector3(),
    public rotation = new THREE.Quaternion(),
    public scale = new THREE.Vector3(1, 1, 1)
  ) {}

  toMatrix4(outMatrix = new THREE.Matrix4()) {
    outMatrix.compose(this.translation, this.rotation, this.scale)
    return outMatrix
  }

  setFromMatrix4(matrix: THREE.Matrix4) {
    matrix.decompose(this.translation, this.rotation, this.scale)
    return this
  }

  static fromMatrix4(matrix: THREE.Matrix4) {
    return new Transform().setFromMatrix4(matrix)
  }
}

export default Transform
