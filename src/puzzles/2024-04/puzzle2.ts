import data from './input.txt?raw'
import moduleText from './puzzle2.ts?raw'
export { moduleText }

type Coord = [x: number, y: number]

const lines = data.split('\n')
const width = lines[0].length
const height = lines.length

function getChar([x, y]: Coord): string | undefined {
  if (x < 0 || x >= width || y < 0 || y >= height) {
    return undefined
  }
  return lines[y].slice(x, x + 1)
}

function checkWord([x, y]: Coord): boolean {
  const nwtse =
    getChar([x - 1, y - 1]) === 'M' && getChar([x + 1, y + 1]) === 'S'
  const setnw =
    getChar([x - 1, y - 1]) === 'S' && getChar([x + 1, y + 1]) === 'M'
  const netsw =
    getChar([x + 1, y - 1]) === 'M' && getChar([x - 1, y + 1]) === 'S'
  const swtne =
    getChar([x + 1, y - 1]) === 'S' && getChar([x - 1, y + 1]) === 'M'
  return (nwtse || setnw) && (netsw || swtne)
}

export function answer() {
  let total = 0
  try {
    for (let y = 0; y <= height; y++) {
      for (let x = 0; x <= width; x++) {
        if (getChar([x, y]) === 'A') {
          if (checkWord([x, y])) {
            total += 1
          }
        }
      }
    }
  } catch (e) {
    console.log(`Error: ${e}`)
  }

  // 1864
  return total
}
