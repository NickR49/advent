import { isEqual } from 'lodash'
import { getLines } from '~/utils/lineUtils'
import data from './input.txt?raw'
import moduleText from './puzzle2.ts?raw'

function extractReports(data: string): string[] {
  return getLines(data)
}

function extractReportLevels(report: string): number[] {
  return report.split(' ').map((level) => parseInt(level, 10))
}

function areLevelsSorted(levels: number[]): boolean {
  const ascSortedLevels = levels.toSorted((a, b) => a - b)
  const descSortedLevels = ascSortedLevels.toReversed()
  return isEqual(levels, ascSortedLevels) || isEqual(levels, descSortedLevels)
}

// Check the variance between levels increment is between 1 and 3
function isSafeVariance(value: number, prevValue: number): boolean {
  const diff = Math.abs(value - prevValue)
  return diff >= 1 && diff <= 3
}

function areSafeLevelVariances(levels: number[]): boolean {
  let prevLevel = levels[0]
  for (const level of levels.slice(1)) {
    if (!isSafeVariance(level, prevLevel)) {
      return false
    }
    prevLevel = level
  }
  return true
}

function isSafeReport(report: string): boolean {
  const levels = extractReportLevels(report)
  if (areLevelsSorted(levels) && areSafeLevelVariances(levels)) {
    return true
  }
  // Recheck each report each time for where one level is removed
  for (let i = 0; i < levels.length; i++) {
    // Exclude item at index i of array
    const splicedLevels = levels.toSpliced(i, 1)
    if (
      areLevelsSorted(splicedLevels) &&
      areSafeLevelVariances(splicedLevels)
    ) {
      return true
    }
  }
  return false
}

export function answer() {
  const reports = extractReports(data)
  const safeReportCount = reports.filter((report) =>
    isSafeReport(report),
  ).length

  return safeReportCount
}

export const confirmedAnswer = 528
export default moduleText
