import { Coord } from './gridUtils'

/**
 * Check if a point is inside a polygon using the ray casting algorithm.
 * Casts a ray from the point to the right and counts edge crossings.
 * Odd crossings = inside, even crossings = outside.
 *
 * @param point The point to test
 * @param polygon Array of vertices forming a closed polygon (first and last should connect)
 * @returns true if point is inside the polygon
 */
export function isInsidePolygon([px, py]: Coord, polygon: Coord[]): boolean {
  let inside = false
  const n = polygon.length

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const [xi, yi] = polygon[i]
    const [xj, yj] = polygon[j]

    // Check if the ray crosses this edge
    if (yi > py !== yj > py) {
      // Calculate x coordinate where ray intersects the edge
      const xIntersect = ((xj - xi) * (py - yi)) / (yj - yi) + xi
      if (px < xIntersect) {
        inside = !inside
      }
    }
  }

  return inside
}

/**
 * Check if a point is on the boundary of a polygon (on any edge).
 *
 * @param point The point to test
 * @param polygon Array of vertices forming a closed polygon
 * @returns true if point is on the polygon boundary
 */
export function isOnPolygonBoundary(
  [px, py]: Coord,
  polygon: Coord[],
): boolean {
  const n = polygon.length

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const [xi, yi] = polygon[i]
    const [xj, yj] = polygon[j]

    // Check if point is on this edge segment
    // First check if point is collinear with the edge
    const cross = (py - yi) * (xj - xi) - (px - xi) * (yj - yi)
    if (cross !== 0) continue

    // Check if point is within the bounding box of the segment
    if (
      px >= Math.min(xi, xj) &&
      px <= Math.max(xi, xj) &&
      py >= Math.min(yi, yj) &&
      py <= Math.max(yi, yj)
    ) {
      return true
    }
  }

  return false
}

/**
 * Check if a point is inside or on the boundary of a polygon.
 */
export function isInsideOrOnPolygon(point: Coord, polygon: Coord[]): boolean {
  return isOnPolygonBoundary(point, polygon) || isInsidePolygon(point, polygon)
}

/**
 * Check if two line segments intersect (excluding endpoints touching).
 * Segment 1: p1 to p2
 * Segment 2: p3 to p4
 */
function segmentsIntersect(
  p1: Coord,
  p2: Coord,
  p3: Coord,
  p4: Coord,
): boolean {
  const [x1, y1] = p1
  const [x2, y2] = p2
  const [x3, y3] = p3
  const [x4, y4] = p4

  // Calculate direction vectors
  const d1x = x2 - x1
  const d1y = y2 - y1
  const d2x = x4 - x3
  const d2y = y4 - y3

  const cross = d1x * d2y - d1y * d2x

  // Parallel lines
  if (cross === 0) return false

  const dx = x3 - x1
  const dy = y3 - y1

  const t = (dx * d2y - dy * d2x) / cross
  const u = (dx * d1y - dy * d1x) / cross

  // Check if intersection point is strictly within both segments (not at endpoints)
  return t > 0 && t < 1 && u > 0 && u < 1
}

/**
 * Check if a rectangle is fully contained within a polygon (handles concave polygons).
 * Checks that:
 * 1. All 4 corners are inside or on the polygon
 * 2. None of the 4 rectangle edges intersect with polygon edges (except at shared vertices)
 *
 * @param minX Left edge of rectangle
 * @param maxX Right edge of rectangle
 * @param minY Top edge of rectangle
 * @param maxY Bottom edge of rectangle
 * @param polygon Array of vertices forming a closed polygon
 * @returns true if the rectangle is fully contained within the polygon
 */
export function isRectangleInsidePolygon(
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  polygon: Coord[],
): boolean {
  // Define the 4 corners
  const topLeft: Coord = [minX, minY]
  const topRight: Coord = [maxX, minY]
  const bottomLeft: Coord = [minX, maxY]
  const bottomRight: Coord = [maxX, maxY]

  // Check all 4 corners are inside or on the polygon
  if (
    !isInsideOrOnPolygon(topLeft, polygon) ||
    !isInsideOrOnPolygon(topRight, polygon) ||
    !isInsideOrOnPolygon(bottomLeft, polygon) ||
    !isInsideOrOnPolygon(bottomRight, polygon)
  ) {
    return false
  }

  // Define the 4 edges of the rectangle
  const rectEdges: [Coord, Coord][] = [
    [topLeft, topRight], // top edge
    [topRight, bottomRight], // right edge
    [bottomRight, bottomLeft], // bottom edge
    [bottomLeft, topLeft], // left edge
  ]

  // Check each rectangle edge against each polygon edge
  const n = polygon.length
  for (const [r1, r2] of rectEdges) {
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const p1 = polygon[i]
      const p2 = polygon[j]

      if (segmentsIntersect(r1, r2, p1, p2)) {
        return false
      }
    }
  }

  return true
}
