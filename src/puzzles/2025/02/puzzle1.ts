import { getLines } from '~/utils/lineUtils'
import { log } from '~/utils/log'
import data from './input.txt?raw'
import moduleText from './puzzle1.ts?raw'

const lines = getLines(data)

// If the first half of the id matches the second half then it is invalid
function isValidId(id: number): boolean {
  const idStr = id.toString()
  if (idStr.length % 2 === 1) {
    return true
  }
  const halfLength = idStr.length / 2
  const firstHalf = idStr.slice(0, halfLength)
  const secondHalf = idStr.slice(halfLength)
  if (firstHalf === secondHalf) {
    return false
  }
  return true
}

function getInvalidIds(start: number, end: number): number[] {
  const invalidIds: number[] = []
  for (let id = start; id <= end; id++) {
    if (!isValidId(id)) {
      invalidIds.push(id)
    }
  }
  return invalidIds
}

export function answer() {
  const startTime = new Date().getTime()
  let total = 0
  const line = lines[0]
  const ranges = line.split(',')

  try {
    ranges.forEach((range) => {
      const [start, end] = range.split('-').map((num) => parseInt(num, 10))
      getInvalidIds(start, end).forEach((invalidId) => (total += invalidId))
    })
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  const endTime = new Date().getTime()
  log(`Time to run: ${endTime - startTime}ms`)
  return total
}

answer()

export const confirmedAnswer = 18952700150
export default moduleText
