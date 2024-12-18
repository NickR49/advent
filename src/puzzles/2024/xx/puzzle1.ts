import { getGrid, printGrid } from '~/utils/gridUtils'
import { getLines, printLines } from '~/utils/lineUtils'
import { log } from '~/utils/log'
import moduleText from './puzzle1.ts?raw'
import data from './sample.txt?raw'
export { moduleText }

const lines = getLines(data)
const grid = getGrid(data)

export function answer() {
  const startTime = new Date().getTime()
  let total = 0

  try {
    printLines(lines)
    printGrid(grid)
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  const endTime = new Date().getTime()
  log(`Time to run: ${endTime - startTime}ms`)
  return total
}

// export const confirmedAnswer =
// export { grid }
