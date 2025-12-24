import { getLines } from '~/utils/lineUtils'

import data from './input.txt?raw'
export { default } from './puzzle2.ts?raw'

export function answer(): number {
  // Extract the two lists
  const list1 = getLines(data)
    .map((line) => parseInt(line.split(/\s+/)[0]))
    .sort((a, b) => a - b)
  const list2 = getLines(data)
    .map((line) => parseInt(line.split(/\s+/)[1]))
    .sort((a, b) => a - b)

  let total = 0

  list1.forEach((item) => {
    // Find number of occurrences of this number in right list
    const count = list2.filter((item2) => item2 === item).length
    total += item * count
  })

  return total
}

export const confirmedAnswer = 21790168
