import { getLines } from '~/utils/lineUtils'
import { log } from '~/utils/log'
import data from './input.txt?raw'
export { default } from './puzzle1.ts?raw'

let lines: string[]

type TupleArray = [number, number][]

export function answer() {
  lines = getLines(data)

  const blankLineIndex = lines.findIndex((line) => line.trim() === '')

  const freshRanges: TupleArray = lines
    .slice(0, blankLineIndex)
    .map((line) => line.split('-').map(Number))
    .filter((arr) => arr.length === 2) as TupleArray

  const availableIngredientIds = lines
    .slice(blankLineIndex + 1)
    .map((line) => Number(line))

  let total = 0

  try {
    availableIngredientIds.forEach((availableIngredientId) => {
      for (const [start, end] of freshRanges) {
        if (availableIngredientId >= start && availableIngredientId <= end) {
          total += 1
          break
        }
      }
    })
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

answer()

export const confirmedAnswer = 643
