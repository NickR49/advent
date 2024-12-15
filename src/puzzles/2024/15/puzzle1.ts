import { cloneDeep } from 'lodash'
import {
  Coord,
  findCell,
  getGrid,
  getGridCell,
  printGrid,
  setGridCell,
} from '~/utils/gridUtils'
import { getLines } from '~/utils/lineUtils'
import { log } from '~/utils/log'
import data from './input.txt?raw'
import moduleText from './puzzle1.ts?raw'
export { moduleText }

const lines = getLines(data)
const blankIndex = lines.indexOf('')
const map = lines.slice(0, blankIndex)
const moves = lines.slice(blankIndex).join('').split('')
const grid = getGrid(map.join('\n'))

function getDirection(move: string): [number, number] {
  switch (move) {
    case '^':
      return [0, -1]
    case 'v':
      return [0, 1]
    case '<':
      return [-1, 0]
    case '>':
      return [1, 0]
    default:
      throw new Error(`Invalid move: ${move}`)
  }
}

function moveRobot(currentCoord: Coord, move: string): Coord {
  const [currX, currY] = currentCoord
  const direction = getDirection(move)
  const destCoord: Coord = [currX + direction[0], currY + direction[1]]
  const destCell = getGridCell(grid, destCoord)
  if (destCell === undefined || destCell === '#') {
    return currentCoord
  }
  if (destCell === 'O') {
    // Find the first open space in the direction of the move
    let nextCoord: Coord = cloneDeep(destCoord)
    while (true) {
      nextCoord = [nextCoord[0] + direction[0], nextCoord[1] + direction[1]]
      const nextCell = getGridCell(grid, nextCoord)
      if (nextCell === undefined || nextCell === '#') {
        return currentCoord
      }
      if (nextCell === '.') {
        // Move box to the open space
        setGridCell(grid, nextCoord, 'O')
        // Move the robot
        break
      }
    }
  }
  // Move the robot
  setGridCell(grid, currentCoord, '.')
  setGridCell(grid, destCoord, '@')
  return destCoord
}

export function answer() {
  let total = 0

  try {
    printGrid(grid)
    let robotCoord = findCell(grid, '@')
    if (!robotCoord) {
      throw new Error('Robot not found')
    }
    moves.forEach((move) => {
      robotCoord = moveRobot(robotCoord!, move)
      // printGrid(grid)
    })
    // Get box coordinates
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        if (getGridCell(grid, [x, y]) === 'O') {
          const gps = y * 100 + x
          total += gps
        }
      }
    }
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

export const confirmedAnswer = 1568399
export { grid }
