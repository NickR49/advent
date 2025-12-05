import { getLines } from '~/utils/lineUtils'
import { log } from '~/utils/log'
import data from './input.txt?raw'
export { default } from './puzzle1.ts?raw'

const lines = getLines(data)

function highestNumber(
  batteries: number[],
  startPosition: number,
  endPosition: number,
): [position: number, number: number] {
  const subSection = batteries.slice(startPosition, endPosition)
  const max = Math.max(...subSection)
  const position = subSection.indexOf(max)
  return [startPosition + position, max]
}

function largestJolt(bank: number[], digits: number): number {
  let total = 0
  let position = 0
  for (let magnitude = digits; magnitude > 0; magnitude--) {
    const [pos, num] = highestNumber(
      bank,
      position,
      bank.length - (magnitude - 1),
    )
    total += num * 10 ** (magnitude - 1)
    position = pos + 1
  }
  return total
}

export function answer() {
  let total = 0

  try {
    lines.forEach((line) => {
      const bank = line
        .split('')
        .map((char) => parseInt(char, 10))
        .filter((num) => !isNaN(num))
      total += largestJolt(bank, 2)
    })
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

answer()

export const confirmedAnswer = 17100
