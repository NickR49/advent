import {
  Coord,
  findCellMatches,
  getGrid,
  getGridCell,
  isInGrid,
} from '~/utils/gridUtils'
import { log } from '~/utils/log'
import data from './input.txt?raw'
import moduleText from './puzzle2.ts?raw'
export { moduleText }

const grid = getGrid(data)

function checkCoord(coord: Coord, height: number): Coord[] {
  if (!isInGrid(grid, coord)) {
    return []
  }
  if (getGridCell(grid, coord) === `${height}`) {
    if (height === 9) {
      return [coord]
    } else {
      return findNines(coord, height)
    }
  }
  return []
}

function findNines([x, y]: Coord, height: number): Coord[] {
  const nines: Coord[] = []
  nines.push(...checkCoord([x, y - 1], height + 1))
  nines.push(...checkCoord([x + 1, y], height + 1))
  nines.push(...checkCoord([x, y + 1], height + 1))
  nines.push(...checkCoord([x - 1, y], height + 1))
  return nines
}

export function answer() {
  let total = 0

  try {
    const zeroes = findCellMatches(grid, '0')
    zeroes.forEach((zero) => {
      total += findNines(zero, 0).length
    })
  } catch (e) {
    log(`Error: ${e}`)
  }

  return total
}

export const confirmedAnswer = 1192
export { grid }
