import { createGraphFromMaze, dijkstra } from '~/utils/dijkstra'
import { Grid, setGridCell } from '~/utils/gridUtils'
import { getLines } from '~/utils/lineUtils'
import { log } from '~/utils/log'

import data from './input.txt?raw'
export { default } from './puzzle1.ts?raw'

const isSample = false

const lines = getLines(data)
const dimensions = isSample ? 7 : 71
const fallenBytes = isSample ? 12 : 1024

const cells = Array(dimensions)
  .fill('.')
  .map(() => Array(dimensions).fill('.'))

export const grid: Grid = { cells, height: dimensions, width: dimensions }
setGridCell(grid, [0, 0], 'S')
setGridCell(grid, [dimensions - 1, dimensions - 1], 'E')

export function answer(): number {
  let total = 0

  try {
    for (let i = 0; i < fallenBytes; i++) {
      const line = lines[i]
      const [x, y] = line.split(',').map(Number)
      grid.cells[y][x] = '#'
    }

    const { graph, start, end } = createGraphFromMaze(grid)
    const path = dijkstra(graph, start, end)

    total = path.length - 1
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

export const confirmedAnswer = 264
