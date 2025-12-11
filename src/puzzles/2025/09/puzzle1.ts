import { Coord, Grid } from '~/utils/gridUtils'
import { getLines } from '~/utils/lineUtils'

import { log } from '~/utils/log'
import data from './input.txt?raw'
export { default } from './puzzle1.ts?raw'

let lines: string[]
export let grid: Grid

export function answer() {
  lines = getLines(data)
  let total = 0

  try {
    const coords: Coord[] = lines.map((line) => {
      const [x, y] = line.split(',').map(Number)
      return [x, y]
    })

    // Go through all combinations of two tile coordinates to see which forms the largest rectangle
    for (let i = 0; i < coords.length; i++) {
      for (let j = i + 1; j < coords.length; j++) {
        const [x1, y1] = coords[i]
        const [x2, y2] = coords[j]
        const width = Math.abs(x1 - x2 + 1)
        const height = Math.abs(y1 - y2 + 1)
        const area = width * height
        if (area > total) {
          total = area
        }
      }
    }
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

answer()

export const confirmedAnswer = 4741848414
