import { Coord, getGrid, getGridCell } from '~/utils/gridUtils'
import data from './input.txt?raw'
export { default } from './puzzle2.ts?raw'

export const grid = getGrid(data)

function checkWord([x, y]: Coord): boolean {
  const nwtse =
    getGridCell(grid, [x - 1, y - 1]) === 'M' &&
    getGridCell(grid, [x + 1, y + 1]) === 'S'
  const setnw =
    getGridCell(grid, [x - 1, y - 1]) === 'S' &&
    getGridCell(grid, [x + 1, y + 1]) === 'M'
  const netsw =
    getGridCell(grid, [x + 1, y - 1]) === 'M' &&
    getGridCell(grid, [x - 1, y + 1]) === 'S'
  const swtne =
    getGridCell(grid, [x + 1, y - 1]) === 'S' &&
    getGridCell(grid, [x - 1, y + 1]) === 'M'
  return (nwtse || setnw) && (netsw || swtne)
}

export function answer() {
  let total = 0
  try {
    for (let y = 0; y <= grid.height; y++) {
      for (let x = 0; x <= grid.width; x++) {
        if (getGridCell(grid, [x, y]) === 'A') {
          if (checkWord([x, y])) {
            total += 1
          }
        }
      }
    }
  } catch (e) {
    console.log(`Error: ${e}`)
  }

  return total
}

export const confirmedAnswer = 1864
