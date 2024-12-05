import data from './input.txt?raw'
import moduleText from './puzzle1.ts?raw'
export { moduleText }

type Direction = [x: number, y: number]
type Coord = [x: number, y: number]

const lines = data.split('\n')
const width = lines[0].length
const height = lines.length
const word = 'XMAS'

function getChar([x, y]: Coord): string | undefined {
  if (x < 0 || x >= width || y < 0 || y >= height) {
    return undefined
  }
  return lines[y].slice(x, x + 1)
}

const directions: Direction[] = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
]

function checkWord([x, y]: Coord): number {
  let wordMatches = 0
  for (const d of directions) {
    let charMatches = 1
    for (let i = 1; i < word.length; i++) {
      const coordToCheck: Coord = [x + d[0] * i, y + d[1] * i]
      if (getChar(coordToCheck) === word.slice(i, i + 1)) {
        charMatches++
      }
    }
    if (charMatches === word.length) {
      wordMatches++
    }
  }
  return wordMatches
}

export function answer() {
  let total = 0
  try {
    for (let y = 0; y <= height; y++) {
      for (let x = 0; x <= width; x++) {
        if (getChar([x, y]) === word.slice(0, 1)) {
          const matches = checkWord([x, y])
          total += matches
        }
      }
    }
  } catch (e) {
    console.log(`Error: ${e}`)
  }

  // 2468
  return total
}
