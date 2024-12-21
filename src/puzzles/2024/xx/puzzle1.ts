import { getGrid, printGrid } from '~/utils/gridUtils'
import { getLines, printLines } from '~/utils/lineUtils'
import { log } from '~/utils/log'
import moduleText from './puzzle1.ts?raw'
import data from './sample.txt?raw'

// const lines = getLines(data)
// export const grid = getGrid(data)

export function answer() {
  const startTime = new Date().getTime()
  let total = 0

  try {
    // Get to it . . .
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  const endTime = new Date().getTime()
  log(`Time to run: ${endTime - startTime}ms`)
  return total
}

answer()

// export const confirmedAnswer =
// export default moduleText
