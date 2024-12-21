import { Coord, Direction, getGrid, getGridCell } from '~/utils/gridUtils'
import data from './input.txt?raw'
import moduleText from './puzzle1.ts?raw'

export const grid = getGrid(data)

const word = 'XMAS'

const directions: Direction[] = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
]

function checkWord([x, y]: Coord): number {
  let wordMatches = 0
  for (const d of directions) {
    let charMatches = 1
    for (let i = 1; i < word.length; i++) {
      const coordToCheck: Coord = [x + d[0] * i, y + d[1] * i]
      if (getGridCell(grid, coordToCheck) === word.slice(i, i + 1)) {
        charMatches++
      }
    }
    if (charMatches === word.length) {
      wordMatches++
    }
  }
  return wordMatches
}

export function answer() {
  let total = 0
  try {
    for (let y = 0; y <= grid.height; y++) {
      for (let x = 0; x <= grid.width; x++) {
        if (getGridCell(grid, [x, y]) === word.slice(0, 1)) {
          const matches = checkWord([x, y])
          total += matches
        }
      }
    }
  } catch (e) {
    console.log(`Error: ${e}`)
  }

  return total
}

export const confirmedAnswer = 2468
export default moduleText
