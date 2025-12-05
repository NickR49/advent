import { getGrid, printGrid } from '~/utils/gridUtils'
import { getLines, printLines } from '~/utils/lineUtils'
import { log } from '~/utils/log'
import moduleText from './puzzle2.ts?raw'
import data from './sample.txt?raw'

const lines = getLines(data)
export const grid = getGrid(data)

export function answer() {
  let total = 0

  try {
    printLines(lines)
    printGrid(grid)
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

answer()

// export const confirmedAnswer =
