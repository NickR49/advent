import { getLines } from '~/utils/lineUtils'
import data from './input.txt?raw'
import moduleText from './puzzle1.ts?raw'
export { moduleText }

export function answer() {
  let total = 0

  // Extract the two lists
  const list1 = getLines(data)
    .map((line) => parseInt(line.split(/\s+/)[0]))
    .sort((a, b) => a - b)
  const list2 = data
    .split('\n')
    .map((line) => parseInt(line.split(/\s+/)[1]))
    .sort((a, b) => a - b)

  // Sum the absolute differences
  for (let i = 0; i < list1.length; i++) {
    total += Math.abs(list1[i] - list2[i])
  }

  return total
}

export const confirmedAnswer = 1151792
