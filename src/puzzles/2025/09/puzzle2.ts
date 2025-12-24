import { Coord } from '~/utils/gridUtils'
import { getLines } from '~/utils/lineUtils'
import { log } from '~/utils/log'
import { isRectangleInsidePolygon } from '~/utils/polygonUtils'

import data from './input.txt?raw'
export { default } from './puzzle2?raw'

let lines: string[]

export function answer(): number {
  lines = getLines(data)

  let total = 0

  try {
    // Populate red tiles in grid as well as intermediate green tiles
    const vertices: Coord[] = lines.map(
      (line) => line.split(',').map(Number) as Coord
    )

    // The rectangle must have RED tiles (polygon vertices) in OPPOSITE corners
    // So we iterate over pairs of polygon vertices that can form opposite corners
    // (i.e., they have different x AND different y coordinates)

    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const [x1, y1] = vertices[i]
        const [x2, y2] = vertices[j]

        const minX = Math.min(x1, x2)
        const maxX = Math.max(x1, x2)
        const minY = Math.min(y1, y2)
        const maxY = Math.max(y1, y2)

        const rectWidth = maxX - minX + 1
        const rectHeight = maxY - minY + 1
        const area = rectWidth * rectHeight

        // Only check if this could be a new maximum
        if (area > total) {
          // Check if rectangle is fully inside the polygon (handles concave polygons)
          if (isRectangleInsidePolygon(minX, maxX, minY, maxY, vertices)) {
            total = area
          }
        }
      }
    }
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

answer()

export const confirmedAnswer = 1508918480
