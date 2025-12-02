import { getLines } from '~/utils/lineUtils'
import { log } from '~/utils/log'
import data from './input.txt?raw'
import moduleText from './puzzle2.ts?raw'

const lines = getLines(data)

const divisorsCache = new Map<number, number[]>()

function getDivisors(n: number): number[] {
  if (divisorsCache.has(n)) {
    return divisorsCache.get(n)!
  }
  const divisors: number[] = []
  for (let i = 1; i <= Math.floor(n / 2); i++) {
    if (n % i === 0) {
      divisors.push(i)
    }
  }
  divisors.push(n)
  divisorsCache.set(n, divisors)
  return divisors
}

// If a number repeats right through the id then it is invalid
function isValidId(id: number): boolean {
  const idStr = id.toString()
  const divisors = getDivisors(idStr.length)
  for (const divisor of divisors) {
    if (divisor === idStr.length) {
      continue
    }
    const segmentLength = divisor
    let isRepeated = true
    const firstSegment = idStr.slice(0, segmentLength)
    for (let i = segmentLength; i < idStr.length; i += segmentLength) {
      const nextSegment = idStr.slice(i, i + segmentLength)
      if (firstSegment !== nextSegment) {
        isRepeated = false
        break
      }
    }
    if (isRepeated) {
      return false
    }
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

export const confirmedAnswer = 28858486244
export default moduleText
