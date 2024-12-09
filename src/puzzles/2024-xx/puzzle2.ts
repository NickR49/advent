import { getGrid, printGrid } from '~/utils/gridUtils'
import { getLines, printLines } from '~/utils/lineUtils'
import moduleText from './puzzle2.ts?raw'
import data from './sample.txt?raw'
export { moduleText }

const lines = getLines(data)
const grid = getGrid(data)

export function answer() {
  let total = 0

  try {
    printLines(lines)
    printGrid(grid)
  } catch (e) {
    console.log(`Error: ${e}`)
  }

  return total
}

// export const confirmedAnswer =
