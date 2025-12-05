import { cloneDeep } from 'lodash'
import { createGraphFromMaze, dijkstra } from '~/utils/dijkstra'
import {
  Coord,
  getGrid,
  getGridCell,
  Grid,
  markGridCell,
  setGridCell,
} from '~/utils/gridUtils'
import { log } from '~/utils/log'
import moduleText from './puzzle1.ts?raw'
import data from './sample.txt?raw'

const isSample = true
const stepsToSave = isSample ? 20 : 100

export const grid = getGrid(data)

function isFreeCell(grid: Grid, coord: Coord): boolean {
  return ['.', 'S', 'E'].includes(getGridCell(grid, coord) ?? '')
}

function getCheatBlocks(grid: Grid): Coord[] {
  const blocks: Coord[] = []
  for (let y = 1; y <= grid.height - 2; y++) {
    for (let x = 1; x <= grid.width - 2; x++) {
      if (getGridCell(grid, [x, y]) === '#') {
        // Needs to be clear on two opposite sides
        if (
          (isFreeCell(grid, [x - 1, y]) && isFreeCell(grid, [x + 1, y])) ||
          (isFreeCell(grid, [x, y - 1]) && isFreeCell(grid, [x, y + 1]))
        ) {
          blocks.push([x, y])
        }
      }
    }
  }
  return blocks
}

// TODO Optimise this brute force solution
export function answer() {
  let total = 0

  try {
    const blocks = getCheatBlocks(grid)
    log(`Found ${blocks.length} cheat blocks`)

    // Mark cheat blocks for visualisation purposes
    blocks.forEach((block) => {
      markGridCell(grid, block)
    })

    const { graph, start, end } = createGraphFromMaze(grid)
    const path = dijkstra(graph, start, end)
    const honestLength = path.length
    log(`honestLength: ${honestLength}`)

    let counter = 0
    const tally: Record<number, number> = {}
    blocks.forEach((block) => {
      const grid2 = cloneDeep(grid)
      setGridCell(grid2, block, '.')
      const { graph, start, end } = createGraphFromMaze(grid2)
      const path = dijkstra(graph, start, end)
      const cheatLength = path.length
      const stepsSaved = honestLength - cheatLength
      if (stepsSaved >= stepsToSave) {
        total += 1
      }
      // Add to tally
      tally[stepsSaved] = tally[stepsSaved] ? tally[stepsSaved] + 1 : 1
      counter++
      if (counter % 100 === 0) {
        log(`${counter}  cheatLength: ${cheatLength}`)
      }
    })
    log(`Tally: ${JSON.stringify(tally)}`)
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

answer()

export const confirmedAnswer = 1459
// export default moduleText
