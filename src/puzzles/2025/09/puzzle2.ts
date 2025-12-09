import {
  Coord,
  createEmptyGrid,
  getGridCell,
  Grid,
  isInGrid,
  isMarked,
  markGridCell,
  setGridCell,
} from '~/utils/gridUtils'
import { getLines } from '~/utils/lineUtils'

import { log } from '~/utils/log'
import data from './sample.txt?raw'
export { default } from './puzzle2.ts?raw'

let lines: string[]
export let grid: Grid

const GREEN_TILE = 'X'
const RED_TILE = '#'
const EMPTY_TILE = '.'

function setTilesInALine(
  grid: Grid,
  coordA: Coord,
  coordB: Coord,
  char: string,
  inclusive: boolean,
) {
  let [x1, y1] = coordA
  let [x2, y2] = coordB

  let xDir = x1 < x2 ? 1 : -1
  let yDir = y1 < y2 ? 1 : -1

  let xAdj = inclusive ? 0 : xDir
  let yAdj = inclusive ? 0 : yDir

  if (x1 === x2) {
    for (let y = y1 + yAdj; y !== y2; y += yDir) {
      setGridCell(grid, [x1, y], char)
    }
  } else if (y1 === y2) {
    for (let x = x1 + xAdj; x !== x2; x += xDir) {
      setGridCell(grid, [x, y1], char)
    }
  } else {
    log(`Provided coords are not in line`)
  }
}

function processRegion(
  grid: Grid,
  char: string,
  [x, y]: Coord,
): [number, number] {
  if (getGridCell(grid, [x, y]) === char) {
    markGridCell(grid, [x, y])
  } else {
    return [0, 0]
  }

  let area = 1
  let edges = 0

  // Check adjacent cells
  for (const [dx, dy] of [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ]) {
    const [nx, ny] = [x + dx, y + dy]
    if (!isInGrid(grid, [nx, ny]) || getGridCell(grid, [nx, ny]) !== char) {
      edges++
    } else {
      if (!isMarked(grid, [nx, ny])) {
        const [a, e] = processRegion(grid, char, [nx, ny])
        area += a
        edges += e
      }
    }
  }
  return [area, edges]
}

export function answer() {
  lines = getLines(data)

  let total = 0

  try {
    let width = 0
    let height = 0
    lines.forEach((line) => {
      const [x, y] = line.split(',').map(Number)
      if (x + 1 > width) {
        width = x + 1
      }
      if (y + 1 > height) {
        height = y + 1
      }
    })
    log(`width: ${width}`)
    log(`height: ${height}`)
    log('Create empty grid')
    grid = createEmptyGrid(width, height)

    log('Get coords')
    // Populate red tiles in grid as well as intermediate green tiles
    const coords: Coord[] = lines.map(
      (line) => line.split(',').map(Number) as Coord,
    )
    log('Got coords')
    let prevCoord = coords[coords.length - 1]
    log('Populating red tiles on grid - start')
    coords.forEach((coord) => {
      setGridCell(grid, coord, RED_TILE)
      setTilesInALine(grid, prevCoord, coord, GREEN_TILE, false)
      prevCoord = coord
    })
    log('Populating red tiles on grid - end')

    // TODO Calculate flood fill starting point
    const startCoord: Coord = [9, 2]

    // Mark the flood fill area
    processRegion(grid, EMPTY_TILE, startCoord)

    // Update marked cells to green tiles
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const coord: Coord = [x, y]
        if (isMarked(grid, coord)) {
          setGridCell(grid, coord, GREEN_TILE)
        }
      }
    }

    // log(`coords: ${JSON.stringify(coords)}`)

    // Go through all combinations of two tile coordinates to see which forms the largest rectangle
    for (let i = 0; i < coords.length; i++) {
      for (let j = i + 1; j < coords.length; j++) {
        const [x1, y1] = coords[i]
        const [x2, y2] = coords[j]
        const width = Math.abs(x1 - x2 + 1)
        const height = Math.abs(y1 - y2 + 1)
        const area = width * height
        // Candidate for largest rectangle
        if (area > total) {
          // Check if all tiles in rectangle are red or green
          let allTilesValid = true
          for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
            for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
              const tile = getGridCell(grid, [x, y])
              if (tile !== RED_TILE && tile !== GREEN_TILE) {
                allTilesValid = false
                break
              }
            }
            if (!allTilesValid) {
              break
            }
          }

          if (allTilesValid) {
            total = area
          }
        }
        log(`Rectangle: ${width} x ${height} = ${area}`)
      }
    }
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

answer()

// export const confirmedAnswer =
