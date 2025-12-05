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
import moduleText from './puzzle1.ts?raw'

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

export function answer() {
  grid = getGrid(data)

  let total = 0

  try {
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

    total = gridMarkedCount(grid)
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

answer()

export const confirmedAnswer = 1553
export default moduleText
