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
import moduleText from './puzzle2.ts?raw'

export const grid = getGrid(data)

function processRegion(
  char: string,
  [x, y]: Coord,
): [area: number, corners: number] {
  const cell = getGridCell(grid, [x, y])
  if (cell === char) {
    markGridCell(grid, [x, y])
  } else {
    return [0, 0]
  }

  let area = 1
  let corners = 0

  // Count corners
  for (const [dx, dy] of [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ]) {
    const adj1 = getGridCell(grid, [x + dx, y])
    const adj2 = getGridCell(grid, [x, y + dy])
    const diag = getGridCell(grid, [x + dx, y + dy])
    if (adj1 !== char && adj2 !== char) {
      corners++ // External corner
    } else if (adj1 === char && adj2 === char && diag !== char) {
      corners++ // Internal corner
    }
  }

  // Check adjacent cells
  for (const [dx, dy] of [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ]) {
    const [nx, ny] = [x + dx, y + dy]
    if (isInGrid(grid, [nx, ny]) && getGridCell(grid, [nx, ny]) === char) {
      if (!isMarked(grid, [nx, ny])) {
        const [a, c] = processRegion(char, [nx, ny])
        area += a
        corners += c
      }
    }
  }
  return [area, corners]
}

export function answer() {
  let total = 0

  try {
    // Iterate through each cell in the grid and build up a count of cells
    // and internal/external vertices for each member of a region
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const coord: Coord = [x, y]
        if (!isMarked(grid, coord)) {
          const cell = getGridCell(grid, coord)!
          const [area, corners] = processRegion(cell, coord)
          // log(`Region ${cell}: ${corners} corners`)
          total += area * corners
        }
      }
    }

    // For each letter, multiply the area by the number of edges
  } catch (e) {
    log(`Error: ${e}`)
  }

  return total
}

export const confirmedAnswer = 978590
export default moduleText
