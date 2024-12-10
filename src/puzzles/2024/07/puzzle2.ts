import { getLines } from '~/utils/lineUtils'
import data from './input.txt?raw'
import moduleText from './puzzle2.ts?raw'
export { moduleText }

function calculate(values: number[], operations: string): number {
  let total = values[0]
  for (let index = 0; index < operations.length; index++) {
    const nextOperation = operations.slice(index, index + 1)
    const nextValue = values[index + 1]
    if (nextOperation === '0') {
      total += nextValue
    } else if (nextOperation === '1') {
      total *= nextValue
    } else {
      total = parseInt(`${total}${nextValue}`)
    }
  }
  return total
}

function isValidLine(total: number, values: number[]): boolean {
  // Use a base 3 number to iterate through combinations
  // ie. 3 values => 2 operators => 111 => 8 - 1 => (2 ^ 3) - 1
  const operationsCount = values.length - 1
  let base3Counter = Math.pow(3, operationsCount) - 1

  while (base3Counter >= 0) {
    const operations = Number(base3Counter)
      .toString(3)
      .padStart(operationsCount, '0')
    const calculatedTotal = calculate(values, operations)
    if (calculatedTotal === total) {
      return true
    }
    base3Counter--
  }

  return false
}

export function answer() {
  let total = 0

  try {
    const lines = getLines(data)
    lines.forEach((line) => {
      const lineTotal = parseInt(line.split(':')[0])
      const lineValues = line
        .split(':')[1]
        .trim()
        .split(/\s+/)
        .map((value) => parseInt(value))

      if (isValidLine(lineTotal, lineValues)) {
        total += lineTotal
      }
    })
  } catch (e) {
    console.log(`Error: ${e}`)
  }

  return total
}

export const confirmedAnswer = 271691107779347
