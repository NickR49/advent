import {
  calcCoord,
  Coord,
  eightDirections,
  getGrid,
  getGridCell,
  Grid,
  gridMarkedCount,
  markGridCell,
} from '~/utils/gridUtils'
import { log } from '~/utils/log'

import data from './input.txt?raw'
export { default } from './puzzle2.ts?raw'

export let grid: Grid

function adjacentCellsCount(coord: Coord): number {
  let count = 0
  eightDirections.forEach((direction) => {
    const adjCoord = calcCoord(coord, direction)
    const adjCell = getGridCell(grid, adjCoord)
    if (adjCell === '@') {
      count++
    }
  })
  return count
}

export function answer(): number {
  grid = getGrid(data)

  let total = 0

  try {
    // Iterate until no more rolls can be removed
    while (true) {
      // Iterate through cells
      for (let x = 0; x < grid.width; x++) {
        for (let y = 0; y < grid.height; y++) {
          const coord: Coord = [x, y]
          if (getGridCell(grid, coord) === '@') {
            if (adjacentCellsCount(coord) < 4) {
              markGridCell(grid, coord)
            }
          }
        }
      }
      const removed = gridMarkedCount(grid)
      // Remove marked cells
      for (let y = 0; y < grid.height; y++) {
        for (let x = 0; x < grid.width; x++) {
          const coord: Coord = [x, y]
          if (getGridCell(grid, coord) === '@' && grid.marked?.[y][x]) {
            grid.cells[y][x] = '.'
            grid.marked![y][x] = false
          }
        }
      }
      if (removed === 0) {
        break
      }
      total += removed
    }
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

answer()

export const confirmedAnswer = 8442
