import { createGraphFromMaze, dijkstra } from '~/utils/dijkstra'
import { Grid, setGridCell } from '~/utils/gridUtils'
import { getLines } from '~/utils/lineUtils'
import { log } from '~/utils/log'
import data from './input.txt?raw'
import moduleText from './puzzle2.ts?raw'
export { moduleText }

const lines = getLines(data)

const isSample = false

const dimensions = isSample ? 7 : 71
const fallenBytes = isSample ? 20 : 3450

const cells = Array(dimensions)
  .fill('.')
  .map(() => Array(dimensions).fill('.'))

const grid: Grid = { cells, height: dimensions, width: dimensions }
setGridCell(grid, [0, 0], 'S')
setGridCell(grid, [dimensions - 1, dimensions - 1], 'E')

export function answer() {
  const startTime = new Date().getTime()
  let total = ''
  const startPoint = isSample ? 0 : 1024

  try {
    for (let i = 0; i < fallenBytes; i++) {
      const line = lines[i]
      const [x, y] = line.split(',').map(Number)
      setGridCell(grid, [x, y], '#')

      if (i > startPoint) {
        const { graph, start, end } = createGraphFromMaze(grid)
        const path = dijkstra(graph, start, end)

        log(`Byte ${i} (${lines[i]}) - ${path.length} steps`)
        if (path.length <= 1) {
          total = lines[i]
          i = fallenBytes
        }
      }
    }
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  const endTime = new Date().getTime()
  log(`Time to run: ${endTime - startTime}ms`)
  return total
}

export const confirmedAnswer = '41,26'
export { grid }
