import { Coord, isEqualCoord } from '~/utils/gridUtils'
import { getLines } from '~/utils/lineUtils'
import { log } from '~/utils/log'
import data from './sample2.txt?raw'
export { default } from './puzzle2.ts?raw'

const lines = getLines(data)

function getButtonMoves(line: string): Coord {
  const match = line.match(/.*?(\d+).*?(\d+)/)
  const x = Number(match?.[1])
  const y = Number(match?.[2])
  return [x, y]
}

const buttonATokens = 3
const buttonBTokens = 1

function playMachine(
  [ax, ay]: Coord,
  [bx, by]: Coord,
  [px, py]: Coord,
): number {
  // Brute force - iterate through all combinations to find cheapest sequence of moves
  for (let i = 10000000000000; i > 0; i--) {
    for (let a = 0; a < i; a++) {
      for (let b = 0; b < 10000000000000; b++) {
        const mx = a * ax + b * bx
        const my = a * ay + b * by
        if (isEqualCoord([mx, my], [px, py])) {
          return b * buttonBTokens + a * buttonATokens
        }
      }
    }
  }
  return 0
}

export function answer() {
  let total = 0

  try {
    const machineCount = lines.length / 4

    for (let i = 0; i < machineCount; i++) {
      const coordA = getButtonMoves(lines[i * 4])
      const coordB = getButtonMoves(lines[i * 4 + 1])
      const [origX, origY] = getButtonMoves(lines[i * 4 + 2])
      const coordP: Coord = [10000000000000 + origX, 10000000000000 + origY]
      const result = playMachine(coordA, coordB, coordP)
      log(`Result: ${result}`)
      total += result
    }
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

// export const confirmedAnswer =
