import {
  Coord,
  Direction,
  findCell,
  getGrid,
  getGridCell,
  isEqualCoord,
  isMarked,
  markGridCell,
  printGrid,
  resetMarked,
  setGridCell,
} from '~/utils/gridUtils'
import { log } from '~/utils/log'

import data from './input.txt?raw'
export { default } from './puzzle1.ts?raw'

export let grid = getGrid(data)

// This will permanently mark the deadends
const deadend = Array(grid.height)
  .fill(false)
  .map(() => Array(grid.width).fill(false))

const directions: Direction[] = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
]

function cellAvailable(coord: Coord): boolean {
  return getGridCell(grid, coord) !== '#' && !isMarked(grid, coord)
}

type Option = 'left' | 'right' | 'forward' | 'stuck'

// From the current location find what options are available (turn left, turn right, go straight)
function getOption([cx, cy]: Coord, directionIndex: number): Option {
  const options: Option[] = []
  // Forward
  const [fx, fy] = directions[directionIndex]
  const forwardCell: Coord = [cx + fx, cy + fy]
  if (cellAvailable(forwardCell)) {
    options.push('forward')
    if (fx === 1 || fy === 1) {
      options.push('forward')
    }
  }
  // Left
  const [lx, ly] = directions[rotateDirection(directionIndex, false)]
  const leftCell: Coord = [cx + lx, cy + ly]
  if (cellAvailable(leftCell)) {
    options.push('left')
    if (lx === 1 || ly === 1) {
      options.push('left')
    }
  }
  // Right
  const [rx, ry] = directions[rotateDirection(directionIndex, true)]
  const rightCell: Coord = [cx + rx, cy + ry]
  if (cellAvailable(rightCell)) {
    options.push('right')
    if (rx === 1 || ry === 1) {
      options.push('right')
    }
  }
  if (options.length === 0) {
    return 'stuck'
  }

  return options[Math.floor(Math.random() * options.length)]
}

function rotateDirection(directionIndex: number, clockwise: boolean): number {
  const rotation = clockwise ? 1 : -1
  return (directionIndex + rotation + 4) % 4
}

function move(directionIndex: number, [x, y]: Coord): Coord {
  const [dx, dy] = directions[directionIndex]
  const destCoord: Coord = [x + dx, y + dy]
  markGridCell(grid, destCoord)
  setGridCell(grid, destCoord, '0') // Debug only
  return destCoord
}

// This basically works for the samples but is horrendously slow for the real data
export function answer(): number {
  let total = 100000000000
  let stuckCount = 0

  try {
    for (let i = 0; i < 1; i++) {
      let score = 0

      // Initialise maze
      grid = getGrid(data)
      let currentCoord = findCell(grid, 'S')
      let directionIndex = 1
      const endCoord = findCell(grid, 'E')
      resetMarked(grid)

      if (i % 100000 === 0) {
        log(`Iteration: ${i}`)
      }

      navigate: while (!isEqualCoord(currentCoord!, endCoord!)) {
        // Choose from the options available
        const option = getOption(currentCoord!, directionIndex)
        switch (option) {
          case 'stuck':
            stuckCount++
            if (stuckCount % 100000 === 0) {
              log(`Stuck: ${stuckCount}`)
            }
            printGrid(grid)
            break navigate
          case 'left':
          case 'right':
            directionIndex = rotateDirection(directionIndex, option === 'right')
            score += 1000
          case 'forward':
            currentCoord = move(directionIndex, currentCoord!)
            score += 1
            break
        }
        if (isEqualCoord(currentCoord!, endCoord!)) {
          log(`We got there!`)
          if (score < total) {
            log(`Iteration: ${i}, Score: ${score}`)
          }
          total = Math.min(total, score)
        }
      }
    }
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  log(`stuckCount: ${stuckCount}`)
  log(`Total: ${total}`)
  return total
}

// export const confirmedAnswer =
