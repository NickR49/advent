import {
  findCell,
  getGrid,
  getGridCell,
  Grid,
  setGridCell,
} from '~/utils/gridUtils'
import { log } from '~/utils/log'
import data from './input.txt?raw'
export { default } from './puzzle1.ts?raw'

export let grid: Grid

export function answer() {
  grid = getGrid(data)

  let total = 0

  try {
    const startCoord = findCell(grid, 'S')
    if (!startCoord) {
      throw new Error('Start coordinate not found')
    }
    setGridCell(grid, startCoord, '|')

    for (let row = 0; row < grid.height - 1; row++) {
      for (let col = 0; col < grid.width; col++) {
        // If there's a beam in this cell then check below
        if (getGridCell(grid, [col, row]) === '|') {
          const belowCell = getGridCell(grid, [col, row + 1])
          switch (belowCell) {
            // Beam continues
            case '.':
              setGridCell(grid, [col, row + 1], '|')
              break
            // Beam splits
            case '^':
              setGridCell(grid, [col - 1, row + 1], '|')
              setGridCell(grid, [col + 1, row + 1], '|')
              total++
              break
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

export const confirmedAnswer = 1504
