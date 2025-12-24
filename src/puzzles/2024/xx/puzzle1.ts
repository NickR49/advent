import { getGrid, printGrid } from '~/utils/gridUtils'
import { getLines, printLines } from '~/utils/lineUtils'
import { log } from '~/utils/log'

import data from './sample.txt?raw'
export { default } from './puzzle1.ts?raw'

// const lines = getLines(data)
// export const grid = getGrid(data)

export function answer(): number {
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
//
