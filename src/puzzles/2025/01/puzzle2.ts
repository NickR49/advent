import { getLines } from '~/utils/lineUtils'
import { log } from '~/utils/log'

import data from './input.txt?raw'
export { default } from './puzzle2.ts?raw'

const lines = getLines(data)

export function answer(): number {
  let total = 0

  try {
    const positions = 100
    let position = 50
    for (const line of lines) {
      const direction = line[0]
      const clicks = parseInt(line.slice(1), 10)
      switch (direction) {
        case 'L':
          for (let i = 0; i < clicks; i++) {
            position -= 1
            if (position === 0) {
              total += 1
            } else if (position === -1) {
              position = positions - 1
            }
          }
          break
        case 'R':
          for (let i = 0; i < clicks; i++) {
            position += 1
            if (position === positions) {
              position = 0
              total += 1
            }
          }
          break
        default:
          throw new Error(`Unknown direction: ${direction}`)
      }
    }
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

answer()

export const confirmedAnswer = 6932
