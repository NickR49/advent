import data from './input.txt?raw'
import moduleText from './puzzle1.ts?raw'
export { moduleText }

export function answer() {
  let total = 0

  // mul(2,4)
  const regex = /mul\((\d+),(\d+)\)/g

  const matches = data.matchAll(regex)

  for (const match of matches) {
    total += parseInt(match[1]) * parseInt(match[2])
  }

  return total
}

export const confirmedAnswer = 168539636
