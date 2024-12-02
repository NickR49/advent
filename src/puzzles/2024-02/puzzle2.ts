import { isEqual } from 'lodash'
import data from './input.txt?raw'
import moduleText from './puzzle2.ts?raw'
export { moduleText }

function extractReportLevels(report: string): number[] {
  return report.split(' ').map((level) => parseInt(level, 10))
}

function areLevelsSorted(levels: number[]): boolean {
  const ascSortedLevels = levels.toSorted((a, b) => a - b)
  const descSortedLevels = ascSortedLevels.toReversed()
  return isEqual(levels, ascSortedLevels) || isEqual(levels, descSortedLevels)
}

function areSafeLevelDiffs(levels: number[]): boolean {
  // Check the levels increment by at least one and at most three
  let prevValue = 0
  let safe = true
  levels.forEach((value, index) => {
    if (index === 0) {
      prevValue = value
    } else {
      const diff = Math.abs(value - prevValue)
      if (diff < 1 || diff > 3) {
        safe = false
      }
      prevValue = value
    }
  })
  return safe
}

function isSafeReport(report: string): boolean {
  const levels = extractReportLevels(report)
  if (areLevelsSorted(levels) && areSafeLevelDiffs(levels)) {
    return true
  }
  // Recheck each report each time for where one level is removed
  for (let i = 0; i < levels.length; i++) {
    // Exclude item at index i of array
    const splicedLevels = levels.toSpliced(i, 1)
    if (areLevelsSorted(splicedLevels) && areSafeLevelDiffs(splicedLevels)) {
      return true
    }
  }
  return false
}

export function answer() {
  let total = 0

  data.split('\n').forEach((report) => {
    if (isSafeReport(report)) {
      total++
    }
  })

  // 528
  return total
}
