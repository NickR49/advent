import data from './input.txt?raw'
import moduleText from './puzzle1.ts?raw'

function reverseString(str: string): string {
  return str.split('').reverse().join('')
}

export function answer() {
  let total = 0

  data.split('\n').forEach((line) => {
    if (line.trim().length > 0) {
      const first = line.match(/\d/)
      const last = reverseString(line).match(/\d/)
      const value = parseInt(`${first}${last}`, 10)
      if (!Number.isNaN(value)) {
        total += value
      }
    }
  })
  return total
}

export const confirmedAnswer = 54331
export default moduleText
