import { getLines } from '~/utils/lineUtils'
import { log } from '~/utils/log'
import data from './input.txt?raw'
export { default } from './puzzle1.ts?raw'

let lines: string[]

type TupleArray = [number, number][]

export function answer() {
  lines = getLines(data)

  let total = 0

  try {
    const blankLineIndex = lines.findIndex((line) => line.trim() === '')

    const freshRanges: TupleArray = lines
      .slice(0, blankLineIndex)
      .map((line) => line.split('-').map(Number))
      .filter((arr) => arr.length === 2)
      .sort((a, b) => a[0] - b[0]) as TupleArray

    // Rationalise the ranges
    const rationalisedRanges: TupleArray = []
    for (const [start, end] of freshRanges) {
      // First entry
      if (rationalisedRanges.length === 0) {
        rationalisedRanges.push([start, end])
        continue
      }

      const prevRange = rationalisedRanges[rationalisedRanges.length - 1]

      const [, prevEnd] = prevRange
      if (start <= prevEnd + 1) {
        // Ranges overlap or are contiguous, merge them
        prevRange[1] = Math.max(prevEnd, end)
      } else {
        // No overlap, add a new range
        rationalisedRanges.push([start, end])
      }
    }

    // Once we know that the ranges don't overlap, we can tally up the ingredient counts
    rationalisedRanges.forEach(([start, end]) => {
      total += end - start + 1
    })
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

answer()

export const confirmedAnswer = 342018167474526
