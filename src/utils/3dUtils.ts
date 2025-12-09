export interface Coord3D {
  x: number
  y: number
  z: number
}

export interface Edge {
  u: number // Index of first box
  v: number // Index of second box
  distance: number
  used?: boolean
}

export function isEqualCoord3D(
  { x: x1, y: y1, z: z1 }: Coord3D,
  { x: x2, y: y2, z: z2 }: Coord3D,
): boolean {
  return x1 === x2 && y1 === y2 && z1 === z2
}
