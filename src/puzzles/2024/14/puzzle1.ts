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
import moduleText from './puzzle1.ts?raw'
export { moduleText }

const lines = getLines(data)
const isSample = false
const width = isSample ? 11 : 101
const height = isSample ? 7 : 103

const grid: Grid = {
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

export function answer() {
  let total = 0

  try {
    let robots = lines.map(getRobot)
    // Move the robots 100 times
    for (let i = 0; i < 100; i++) {
      robots = moveRobots(robots)
    }
    // Show as a grid
    robots.forEach((robot) => {
      const count = Number(getGridCell(grid, robot.pos))
      setGridCell(grid, robot.pos, String(count + 1))
    })
    // Check quadrants
    const quadrants = [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]
    const qWidth = (width - 1) / 2
    const qHeight = (height - 1) / 2
    const quadrantCounts: number[] = quadrants.map(([qx, qy]) => {
      const xOffset = qx === 0 ? 0 : qWidth + 1
      const yOffset = qy === 0 ? 0 : qHeight + 1
      let count = 0
      for (let y = 0; y < qHeight; y++) {
        for (let x = 0; x < qWidth; x++) {
          count += Number(getGridCell(grid, [xOffset + x, yOffset + y]))
        }
      }
      return count
    })
    // log(`Quadrant Counts: ${JSON.stringify(quadrantCounts)}`)
    total = quadrantCounts.reduce((acc, count) => acc * count, 1)
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

export const confirmedAnswer = 216027840
export { grid }
