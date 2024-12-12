import {
  Coord,
  getGrid,
  getGridCell,
  isInGrid,
  isMarked,
  markGridCell,
} from '~/utils/gridUtils'
import { log } from '~/utils/log'
import data from './input.txt?raw'
import moduleText from './puzzle1.ts?raw'
export { moduleText }

const grid = getGrid(data)

function processRegion(char: string, [x, y]: Coord): [number, number] {
  if (getGridCell(grid, [x, y]) === char) {
    markGridCell(grid, [x, y])
  } else {
    return [0, 0]
  }

  let area = 1
  let edges = 0

  // Check adjacent cells
  for (const [dx, dy] of [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ]) {
    const [nx, ny] = [x + dx, y + dy]
    if (!isInGrid(grid, [nx, ny]) || getGridCell(grid, [nx, ny]) !== char) {
      edges++
    } else {
      if (!isMarked(grid, [nx, ny])) {
        const [a, e] = processRegion(char, [nx, ny])
        area += a
        edges += e
      }
    }
  }
  return [area, edges]
}

export function answer() {
  let total = 0

  try {
    // Iterate through each cell in the grid and build up a count of cells and edges for each member of a region
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const coord: Coord = [x, y]
        if (!isMarked(grid, coord)) {
          const cell = getGridCell(grid, coord)!
          const [area, edges] = processRegion(cell, coord)
          total += area * edges
        }
      }
    }

    // For each letter, multiply the area by the number of edges
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

export const confirmedAnswer = 1546338
export { grid }
