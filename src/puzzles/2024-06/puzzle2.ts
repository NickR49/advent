import { cloneDeep } from 'lodash'
import data from './input.txt?raw'
import moduleText from './puzzle2.ts?raw'
export { moduleText }

const originalData = data

let map = originalData.split('\n')
const width = map[0].length
const height = map.length

type Direction = [x: number, y: number]
type Coord = [x: number, y: number]

let directionIndex = 0
const directions: Direction[] = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
]

function getChar([x, y]: Coord) {
  return map[y].slice(x, x + 1)
}

function setChar([x, y]: Coord, char: string) {
  const line = map[y]
  map[y] = line.substring(0, x) + char + line.substring(x + 1)
}

function findGuardLocation(): Coord | undefined {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (getChar([x, y]) === '^') {
        return [x, y]
      }
    }
  }
}

function findNextObstacleLocation(currLoc: Coord): Coord {
  if (currLoc[0] < width) {
    return [currLoc[0] + 1, currLoc[1]]
  }
  console.log(`Obstacle now in line ${currLoc[1] + 1}`)
  return [0, currLoc[1] + 1]
}

function findNextFreeObstacleLocation(currLoc: Coord): Coord {
  let checkLoc = currLoc
  while (true) {
    checkLoc = findNextObstacleLocation(checkLoc)
    if (checkLoc[1] >= height) {
      console.log(`We have exited the matrix`)
      return [-1, -1]
    }
    if (['.', 'X'].includes(getChar(checkLoc))) {
      return checkLoc
    }
  }
}

function printCoord([x, y]: Coord) {
  return `[${x}, ${y}]`
}

function printMap() {
  console.log('----------------------')
  map.forEach((line) => console.log(line))
}

function moveGuard(
  guardLoc: Coord,
  direction: Direction,
): [Coord | undefined, Direction] {
  const [guardX, guardY] = guardLoc
  // Check if there is an obstacle
  const futureCoord: Coord = [guardX + direction[0], guardY + direction[1]]
  const [futureX, futureY] = futureCoord

  if (futureX < 0 || futureX >= width || futureY < 0 || futureY >= height) {
    return [undefined, direction]
  }
  if (!['.', 'X'].includes(getChar([futureX, futureY]))) {
    // Obstacle so change direction
    directionIndex = (directionIndex + 1) % 4
    const newDirection = directions[directionIndex]
    return moveGuard(guardLoc, newDirection)
  } else {
    // Move guard forward
    return [[futureX, futureY], direction]
  }
}

function isCoordEqual(coord1: Coord | undefined, coord2: Coord | undefined) {
  if (!coord1 && !coord2) {
    return true
  }
  if (!coord1 || !coord2) {
    return false
  }
  const [x1, y1] = coord1
  const [x2, y2] = coord2
  return x1 === x2 && y1 === y2
}

// Sample obstacle coords -
//  [3,6]
//  [6,7]
//  [7,7]
//  [1,8]
//  [3,8]
//  [7,9]

export function answer() {
  let total = 0
  let actualLoopCount = 0
  let assumedLoopCount = 0
  let exitedGrid = 0

  try {
    let origGuardLoc = findGuardLocation()
    const origGuardDir: Direction = [0, -1]

    // Iterate through obstacle locations
    let obstLoc: Coord = [-1, 0]
    let obstCounter = 0
    while (true) {
      obstLoc = findNextFreeObstacleLocation(obstLoc)
      if (obstLoc[0] === -1 && obstLoc[1] === -1) {
        break
      }
      obstCounter++
      map = originalData.split('\n')
      setChar(obstLoc, 'O')

      let snapshotGuardLoc = cloneDeep(origGuardLoc)
      let snapshotGuardDir = cloneDeep(origGuardDir)

      let guardLoc = cloneDeep(snapshotGuardLoc)
      if (guardLoc) {
        let guardDir: Direction = cloneDeep(snapshotGuardDir)
        let snapshots = 0
        let iterations = 0
        directionIndex = 0
        while (true) {
          setChar(guardLoc, 'X') // Don't need this - just useful for debugging
          const [newGuardLoc, newGuardDir] = moveGuard(guardLoc, guardDir)
          if (newGuardLoc === undefined) {
            // Have exited the grid
            exitedGrid++
            break
          }
          guardLoc = cloneDeep(newGuardLoc)
          guardDir = cloneDeep(newGuardDir)
          if (
            isCoordEqual(guardLoc, snapshotGuardLoc) &&
            isCoordEqual(guardDir, snapshotGuardDir)
          ) {
            // Found a loop
            total += 1
            actualLoopCount++
            break
          }
          if (iterations === 10000) {
            snapshotGuardDir = cloneDeep(guardDir)
            snapshotGuardLoc = cloneDeep(guardLoc)
          }
          if (iterations > 1000000) {
            // Assuming we have a loop
            total += 1
            assumedLoopCount++
            break
          }
          snapshots++
          iterations++
        }
      }
    }
  } catch (e) {
    console.log(`Error: ${e}`)
  }

  console.log(`Actual loop count: ${actualLoopCount}`)
  console.log(`Assumed loop count: ${assumedLoopCount}`)
  console.log(`Exited grid count: ${exitedGrid}`)

  // 1686
  return total
}
