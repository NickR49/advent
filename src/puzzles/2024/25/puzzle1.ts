import { getGrid, getGridCell } from '~/utils/gridUtils'
import { log } from '~/utils/log'
import data from './input.txt?raw'
import moduleText from './puzzle1.ts?raw'

type Lock = number[]
type Key = number[]

function parseLock(lines: string[]): Lock {
  const pins: number[] = []
  const grid = getGrid(lines.slice(1, 7).join('\n'))
  for (let x = 0; x <= 4; x++) {
    for (let y = 0; y <= 5; y++) {
      if (getGridCell(grid, [x, y]) === '.') {
        pins.push(y)
        break
      }
    }
  }
  return pins
}

function parseKey(lines: string[]): Key {
  const pins: number[] = []
  const grid = getGrid(lines.slice(0, 6).join('\n'))
  for (let x = 0; x <= 4; x++) {
    for (let y = 5; y >= 0; y--) {
      if (getGridCell(grid, [x, y]) === '.') {
        pins.push(5 - y)
        break
      }
    }
  }
  return pins
}

function parseInput(data: string): { locks: Lock[]; keys: Key[] } {
  const locks: Lock[] = []
  const keys: Key[] = []

  const blocks = data.split('\n\n')
  blocks.forEach((block) => {
    const lines = block.split('\n')
    if (lines[0] === '#####') {
      locks.push(parseLock(lines))
    } else if (lines[0] === '.....') {
      keys.push(parseKey(lines))
    } else {
      console.log(`Invalid first line: ${lines[0]}`)
    }
  })

  return { locks, keys }
}

function keyFitsLock(key: Key, lock: Lock): boolean {
  for (let i = 0; i <= 4; i++) {
    if (key[i] + lock[i] > 5) {
      return false
    }
  }
  return true
}

export function answer() {
  let total = 0

  try {
    const { locks, keys } = parseInput(data)

    // Try every key with every lock
    locks.forEach((lock) => {
      keys.forEach((key) => {
        if (keyFitsLock(key, lock)) {
          total++
        }
      })
    })
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

answer()

export const confirmedAnswer = 3365
export default moduleText
