import data from './input.txt?raw'
import moduleText from './puzzle2.ts?raw'

const numbers = [
  'xxxxxxxxxxxxx',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
]

function reverseString(str: string): string {
  return str.split('').reverse().join('')
}

const regex = /(one|two|three|four|five|six|seven|eight|nine|\d)/gi
const backwardsRegex = /(eno|owt|eerht|ruof|evif|xis|neves|thgie|enin|\d)/gi

function convertWordToNumber(word: string): number {
  if (word.length === 1) {
    return parseInt(word, 10)
  }
  const index = numbers.indexOf(word.toLowerCase())
  return index
}

export function answer() {
  let total = 0
  data.split('\n').forEach((line) => {
    if (line.trim().length > 0) {
      const matches = line.match(regex) ?? ['0']
      const firstMatch = (line.match(regex) ?? ['0'])[0]
      const lastMatch = reverseString(
        (reverseString(line).match(backwardsRegex) ?? ['0'])[0],
      )
      const firstNum = convertWordToNumber(firstMatch)
      const lastNum = convertWordToNumber(lastMatch)
      const value = parseInt(`${firstNum}${lastNum}`, 10)
      total += value
    }
  })
  // 54518
  return total
}

export default moduleText
