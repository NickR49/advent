import { cloneDeep } from 'lodash'
import {
  addUniqueCoord,
  Coord,
  findCell,
  getGrid,
  getGridCell,
  printGrid,
  setGridCell,
  sortCoords,
} from '~/utils/gridUtils'
import { getLines } from '~/utils/lineUtils'
import { log } from '~/utils/log'
import data from './input.txt?raw'
export { default } from './puzzle2.ts?raw'

const lines = getLines(data)
const blankIndex = lines.indexOf('')

// Initialise the grid
const mapLines = lines.slice(0, blankIndex)
const doubledMapLines = mapLines.map((line) => {
  return line
    .replaceAll('O', '[]')
    .replaceAll('.', '..')
    .replaceAll('#', '##')
    .replaceAll('@', '@.')
})
export const grid = getGrid(doubledMapLines.join('\n'))

// Get all the robot moves
const moves = lines.slice(blankIndex).join('').split('')

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

function moveRobotSideways(currentCoord: Coord, move: string): Coord {
  const [currX, currY] = currentCoord
  const direction = getDirection(move)
  const destCoord: Coord = [currX + direction[0], currY + direction[1]]
  const destCell = getGridCell(grid, destCoord)
  if (destCell === undefined || destCell === '#') {
    return currentCoord
  }
  // Find the first open space in the direction of the move
  if (destCell === '[' || destCell === ']') {
    let nextCoord = cloneDeep(destCoord)
    while (true) {
      nextCoord = [nextCoord[0] + direction[0], nextCoord[1] + direction[1]]
      const nextCell = getGridCell(grid, nextCoord)
      if (nextCell === undefined || nextCell === '#') {
        return currentCoord
      }
      if (nextCell === '.') {
        // Shuffle boxes into the open space
        let prevCoord: Coord = [
          nextCoord[0] - direction[0],
          nextCoord[1] - direction[1],
        ]
        while (prevCoord[0] !== currentCoord[0]) {
          const prevCell = getGridCell(grid, prevCoord)!
          setGridCell(grid, nextCoord, prevCell)
          prevCoord = [prevCoord[0] - direction[0], prevCoord[1] - direction[1]]
          nextCoord = [nextCoord[0] - direction[0], nextCoord[1] - direction[1]]
        }
        break
      }
    }
  }
  // Move the robot
  setGridCell(grid, currentCoord, '.')
  setGridCell(grid, destCoord, '@')
  return destCoord
}

function checkAboveBelow(coords: Coord[], direction: number, coord: Coord) {
  const cell = getGridCell(grid, coord)
  let leftCoord: Coord
  let rightCoord: Coord
  if (cell === '[') {
    leftCoord = coord
    rightCoord = [coord[0] + 1, coord[1]]
  } else if (cell === ']') {
    rightCoord = coord
    leftCoord = [coord[0] - 1, coord[1]]
  } else if (cell === '#') {
    throw new Error('Wall encountered')
  } else {
    return coords
  }

  addUniqueCoord(coords, leftCoord)
  checkAboveBelow(coords, direction, [leftCoord[0], leftCoord[1] + direction])

  addUniqueCoord(coords, rightCoord)
  checkAboveBelow(coords, direction, [rightCoord[0], rightCoord[1] + direction])

  return coords
}

function moveGroup(coords: Coord[], direction: number) {
  // Order box coords from top to bottom (or vice versa)
  const sortedCoords =
    direction === -1 ? sortCoords(coords) : sortCoords(coords).reverse()
  // Move the boxes
  sortedCoords.forEach((coord) => {
    const cell = getGridCell(grid, coord)
    setGridCell(grid, [coord[0], coord[1] + direction], cell!)
    setGridCell(grid, coord, '.')
  })
}

function moveRobotVertically(currentCoord: Coord, move: string): Coord {
  const [currX, currY] = currentCoord
  const direction = getDirection(move)
  const destCoord: Coord = [currX + direction[0], currY + direction[1]]
  const destCell = getGridCell(grid, destCoord)
  if (destCell === undefined || destCell === '#') {
    return currentCoord
  }
  if (destCell === '[' || destCell === ']') {
    // Recursively find boxes that would get moved
    let groupCoords: Coord[] = []
    try {
      groupCoords = checkAboveBelow(groupCoords, direction[1], destCoord)
      moveGroup(groupCoords, direction[1])
    } catch (error) {
      // If the boxes encountered a wall then we can't move
      return currentCoord
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
    let robotCoord = findCell(grid, '@')
    if (!robotCoord) {
      throw new Error('Robot not found')
    }
    moves.forEach((move) => {
      if (move === '<' || move === '>') {
        robotCoord = moveRobotSideways(robotCoord!, move)
      } else {
        robotCoord = moveRobotVertically(robotCoord!, move)
      }
    })
    // Get box coordinates
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        if (getGridCell(grid, [x, y]) === '[') {
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

export const confirmedAnswer = 1575877
