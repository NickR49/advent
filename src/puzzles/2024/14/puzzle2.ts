import { c } from 'vinxi/dist/types/lib/logger'
import {
  Coord,
  Direction,
  getGridCell,
  Grid,
  setGridCell,
} from '~/utils/gridUtils'
import { getLines } from '~/utils/lineUtils'
import { log } from '~/utils/log'
import data from './input.txt?raw'
export { default } from './puzzle2.ts?raw'

const lines = getLines(data)
const isSample = false
const width = isSample ? 11 : 101
const height = isSample ? 7 : 103

export let grid: Grid = {
  width,
  height,
  cells: Array(height)
    .fill('0')
    .map(() => Array(width).fill('0')),
}

interface Robot {
  pos: Coord
  vel: Direction
}

function getRobot(line: string): Robot {
  const matches = line.match(/p=(\d+),(\d+)\s+v=(-?\d+),(-?\d+)/)
  const pos: Coord = [Number(matches?.[1]), Number(matches?.[2])]
  const vel: Coord = [Number(matches?.[3]), Number(matches?.[4])]
  return { pos, vel }
}

function moveRobots(robots: Robot[]): Robot[] {
  return robots.map((robot) => {
    let x = robot.pos[0] + robot.vel[0]
    if (x < 0) {
      x += width
    } else if (x >= width) {
      x -= width
    }
    let y = robot.pos[1] + robot.vel[1]
    if (y < 0) {
      y += height
    } else if (y >= height) {
      y -= height
    }
    return {
      ...robot,
      pos: [x, y],
    }
  })
}

function getGrid(robots: Robot[]): Grid {
  const grid: Grid = {
    width,
    height,
    cells: Array(height)
      .fill('0')
      .map(() => Array(width).fill('0')),
  }
  robots.forEach((robot) => {
    const count = Number(getGridCell(grid, robot.pos))
    setGridCell(grid, robot.pos, String(count + 1))
  })
  return grid
}

// Check if all grid cells contain either 0 or 1 robots
function checkPositionCounts(grid: Grid): boolean {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const count = Number(getGridCell(grid, [x, y]))
      if (count > 1) {
        return false
      }
    }
  }
  return true
}

export function answer() {
  let total = 0

  try {
    let robots = lines.map(getRobot)
    // Move the robots until there either 0 or 1 robot in each position
    while (true) {
      robots = moveRobots(robots)
      total++
      grid = getGrid(robots)
      if (checkPositionCounts(grid)) {
        break
      }
    }
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

export const confirmedAnswer = 6876
