import data from './input.txt?raw'
import moduleText from './puzzle1.ts?raw'
export { moduleText }

const map = data.split('\n')
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

function setChar([x, y]: Coord) {
  const line = map[y]
  map[y] = line.substring(0, x) + 'X' + line.substring(x + 1)
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

function moveGuard(
  guardLoc: Coord,
  direction: Direction,
): [Coord | undefined, Direction] {
  const [guardX, guardY] = guardLoc
  // Check if there is an obstacle
  const [futureX, futureY] = [guardX + direction[0], guardY + direction[1]]
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

export function answer() {
  let total = 0

  try {
    let guardLoc = findGuardLocation()
    if (guardLoc) {
      let currDir: Direction = [0, -1]
      // Iterate through guard moves until they leave the map
      while (true) {
        setChar(guardLoc)
        const [newGuardLoc, newDir] = moveGuard(guardLoc, currDir)
        if (newGuardLoc === undefined) {
          break
        }
        guardLoc = newGuardLoc
        currDir = newDir
      }
      // Count guard locations
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (getChar([x, y]) === 'X') {
            total += 1
          }
        }
      }
    }
  } catch (e) {
    console.log(`Error: ${e}`)
  }

  // 5177
  return total
}
