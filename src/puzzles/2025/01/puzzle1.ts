import { getLines } from '~/utils/lineUtils'
import { log } from '~/utils/log'
import data from './input.txt?raw'
import moduleText from './puzzle1.ts?raw'

const lines = getLines(data)

export function answer() {
  let total = 0

  try {
    const positions = 100
    let position = 50
    for (const line of lines) {
      const direction = line[0]
      const clicks = parseInt(line.slice(1), 10)
      switch (direction) {
        case 'L':
          position -= clicks
          break
        case 'R':
          position += clicks
          break
        default:
          throw new Error(`Unknown direction: ${direction}`)
      }
      position = (position + 1000000) % positions
      if (position === 0) {
        total += 1
      }
    }
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

answer()

export const confirmedAnswer = 1172
export default moduleText
