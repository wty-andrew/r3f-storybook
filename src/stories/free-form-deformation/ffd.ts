import * as R from 'rambda'
import * as THREE from 'three'

const _TxU = new THREE.Vector3()
const _SxU = new THREE.Vector3()
const _SxT = new THREE.Vector3()
const _xyz = new THREE.Vector3()
const _stu = new THREE.Vector3()

const combinations = (n: number, k: number) => {
  if (k > n) return 0
  const k_ = Math.min(k, n - k)
  return R.range(0, k_).reduce((acc, i) => (acc * (n - i)) / (i + 1), 1)
}

// memoize
const comb: number[][] = Array.from({ length: 10 }, (_, i) =>
  Array.from({ length: 10 }, (_, j) => combinations(i, j))
)

const bernstein = (n: number, k: number, x: number) =>
  comb[n][k] * (1 - x) ** (n - k) * x ** k

export class ParametricCoordinate {
  constructor(
    public origin: THREE.Vector3,
    public sAxis: THREE.Vector3,
    public tAxis: THREE.Vector3,
    public uAxis: THREE.Vector3
  ) {}

  static fromBbox(bbox: THREE.Box3, padding = 0) {
    const { min, max } = bbox
    const origin = min.clone().subScalar(padding)
    const { x: x1, y: y1, z: z1 } = max.clone().addScalar(padding)
    const { x: x0, y: y0, z: z0 } = origin

    return new ParametricCoordinate(
      origin,
      new THREE.Vector3(x1 - x0, 0, 0),
      new THREE.Vector3(0, y1 - y0, 0),
      new THREE.Vector3(0, 0, z1 - z0)
    )
  }
}

export class ControlPoints {
  points: THREE.Vector3[]
  private _width: number
  private _length: number
  private _height: number

  constructor(coord: ParametricCoordinate, l: number, m: number, n: number) {
    this._width = l + 1
    this._length = m + 1
    this._height = n + 1
    const total = this._width * this._length * this._height
    this.points = Array.from({ length: total }, () => new THREE.Vector3())

    for (const [point, i, j, k] of this) {
      point
        .copy(coord.origin)
        .addScaledVector(coord.sAxis, i / l)
        .addScaledVector(coord.tAxis, j / m)
        .addScaledVector(coord.uAxis, k / n)
    }
  }

  index(i: number, j: number, k: number) {
    return this.points[i * this._length * this._height + j * this._height + k]
  }

  get l() {
    return this._width - 1
  }

  get m() {
    return this._length - 1
  }

  get n() {
    return this._height - 1
  }

  *[Symbol.iterator]() {
    for (let i = 0; i <= this.l; i++) {
      for (let j = 0; j <= this.m; j++) {
        for (let k = 0; k <= this.n; k++) {
          yield [this.index(i, j, k), i, j, k] as const
        }
      }
    }
  }
}

const cartesianToParametric = (
  position: THREE.BufferAttribute,
  coord: ParametricCoordinate
) => {
  const { origin, sAxis, tAxis, uAxis } = coord
  _TxU.crossVectors(tAxis, uAxis)
  _SxU.crossVectors(sAxis, uAxis)
  _SxT.crossVectors(sAxis, tAxis)
  const sDenom = _TxU.dot(sAxis)
  const tDenom = _SxU.dot(tAxis)
  const uDenom = _SxT.dot(uAxis)

  const transformed = position.clone()
  for (let i = 0; i < position.count; i++) {
    _xyz.fromBufferAttribute(position, i).sub(origin)
    transformed.setXYZ(
      i,
      _TxU.dot(_xyz) / sDenom,
      _SxU.dot(_xyz) / tDenom,
      _SxT.dot(_xyz) / uDenom
    )
  }
  return transformed
}

const parametricToCartesian = (
  point: THREE.Vector3,
  controlPoints: ControlPoints,
  displacedPoint = new THREE.Vector3()
) => {
  const { l, m, n } = controlPoints
  const { x: s, y: t, z: u } = point
  displacedPoint.set(0, 0, 0)

  // inline as iterator cause performance penalty
  for (let i = 0; i <= l; i++) {
    for (let j = 0; j <= m; j++) {
      for (let k = 0; k <= n; k++) {
        const weight = bernstein(l, i, s) * bernstein(m, j, t) * bernstein(n, k, u)
        displacedPoint.addScaledVector(controlPoints.index(i, j, k), weight)
      }
    }
  }
  return displacedPoint
}

class FFD {
  geometry: THREE.BufferGeometry
  controlPoints: ControlPoints
  position: THREE.BufferAttribute

  constructor(
    geometry: THREE.BufferGeometry,
    coord: ParametricCoordinate,
    l = 2,
    m = 2,
    n = 2
  ) {
    this.geometry = geometry
    this.controlPoints = new ControlPoints(coord, l, m, n)

    const position = this.geometry.getAttribute('position') as THREE.BufferAttribute
    this.position = cartesianToParametric(position, coord)
  }

  deform() {
    const position = this.geometry.getAttribute('position') as THREE.BufferAttribute
    for (let i = 0; i < this.position.count; i++) {
      _stu.fromBufferAttribute(this.position, i)
      parametricToCartesian(_stu, this.controlPoints, _xyz)
      position.setXYZ(i, _xyz.x, _xyz.y, _xyz.z)
    }
    position.needsUpdate = true
  }
}

export default FFD
