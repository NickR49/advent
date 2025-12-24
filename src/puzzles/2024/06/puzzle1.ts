import {
  Coord,
  Direction,
  getGrid,
  getGridCell,
  setGridCell,
} from '~/utils/gridUtils'

import data from './input.txt?raw'
export { default } from './puzzle1.ts?raw'

export const grid = getGrid(data)

let directionIndex = 0
const directions: Direction[] = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
]

function findGuardLocation(): Coord | undefined {
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      if (getGridCell(grid, [x, y]) === '^') {
        return [x, y]
      }
    }
  }
}

function moveGuard(
  guardLoc: Coord,
  direction: Direction
): [Coord | undefined, Direction] {
  const [guardX, guardY] = guardLoc
  // Check if there is an obstacle
  const [futureX, futureY] = [guardX + direction[0], guardY + direction[1]]
  if (
    futureX < 0 ||
    futureX >= grid.width ||
    futureY < 0 ||
    futureY >= grid.height
  ) {
    return [undefined, direction]
  }
  const cell = getGridCell(grid, [futureX, futureY])
  if (!['.', 'X'].includes(cell ?? '')) {
    // Obstacle so change direction
    directionIndex = (directionIndex + 1) % 4
    const newDirection = directions[directionIndex]
    return moveGuard(guardLoc, newDirection)
  } else {
    // Move guard forward
    return [[futureX, futureY], direction]
  }
}

export function answer(): number {
  let total = 0

  try {
    let guardLoc = findGuardLocation()
    if (guardLoc) {
      let currDir: Direction = [0, -1]
      // Iterate through guard moves until they leave the map
      while (true) {
        setGridCell(grid, guardLoc, 'X')
        const [newGuardLoc, newDir] = moveGuard(guardLoc, currDir)
        if (newGuardLoc === undefined) {
          break
        }
        guardLoc = newGuardLoc
        currDir = newDir
      }
      // Count guard locations
      for (let y = 0; y < grid.height; y++) {
        for (let x = 0; x < grid.width; x++) {
          if (getGridCell(grid, [x, y]) === 'X') {
            total += 1
          }
        }
      }
      // printGrid(grid)
    }
  } catch (e) {
    console.log(`Error: ${e}`)
  }

  return total
}

export const confirmedAnswer = 5177
