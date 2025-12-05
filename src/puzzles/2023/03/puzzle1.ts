import data from './input.txt?raw'
export { default } from './puzzle1.ts?raw'

interface SchematicNumber {
  value: number
  x: number
  y: number
}

// Match anything not a number or a period
const symbolRegex = /[^0-9\.]/

function hasAdjacentSymbol(allLines: string[], num: SchematicNumber): boolean {
  // Check the line above
  if (num.y > 0) {
    const lineAbove = allLines[num.y - 1]
    const stringAbove = lineAbove.substring(
      num.x - 1,
      num.x + String(num.value).length + 1,
    )
    if (symbolRegex.test(stringAbove)) {
      return true
    }
  }
  // Check the line below
  if (num.y < allLines.length - 1) {
    const lineBelow = allLines[num.y + 1]
    const stringBelow = lineBelow.substring(
      num.x - 1,
      num.x + String(num.value).length + 1,
    )

    if (symbolRegex.test(stringBelow)) {
      return true
    }
  }
  const currentLine = allLines[num.y]
  // Check to the left
  if (num.x > 0) {
    const charLeft = currentLine.charAt(num.x - 1)
    if (symbolRegex.test(charLeft)) {
      return true
    }
  }
  // Check to the right
  if (num.x < currentLine.length - 1) {
    const charRight = currentLine.charAt(num.x + String(num.value).length)
    if (symbolRegex.test(charRight)) {
      return true
    }
  }

  return false
}

export function answer() {
  let total = 0
  const numbers: SchematicNumber[] = []

  // Identify all contiguous numbers in the input
  // Store the numbers in an array with their coordinates
  data.split('\n').forEach((line, y) => {
    const matches = line.matchAll(/(\d+)/g)
    for (const match of matches) {
      numbers.push({
        value: parseInt(match[1]),
        x: match.index,
        y,
      })
    }
  })

  // Iterate through each number and check whether there are any adjacent symbols
  const allLines: string[] = data.split('\n')
  numbers
    .filter((num) => hasAdjacentSymbol(allLines, num))
    .forEach((num) => (total += num.value))

  return total
}

export const confirmedAnswer = 560670
