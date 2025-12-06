import { getGrid, Grid, printGrid } from '~/utils/gridUtils'
import { getLines, printLines } from '~/utils/lineUtils'
import { log } from '~/utils/log'
import data from './sample.txt?raw'
export { default } from './puzzle2.ts?raw'

// let lines: string[]
// export let grid: Grid

export function answer() {
  // lines = getLines(data)
  // grid = getGrid(data)

  let total = 0

  try {
    // Get to it . . .
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

answer()

// export const confirmedAnswer =
