import { isEqual } from 'lodash'
import data from './input.txt?raw'

export function answer() {
  let total = 0

  console.log(`${data.split('\n').length} lines to process`)

  data.split('\n').forEach((report) => {
    const levels = report.split(' ').map((level) => parseInt(level, 10))
    const ascSortedLevels = levels.toSorted((a, b) => a - b)
    const descSortedLevels = ascSortedLevels.toReversed()
    if (isEqual(levels, ascSortedLevels) || isEqual(levels, descSortedLevels)) {
      // Check the levels increment by at least one and at most three
      let prevValue = 0
      let include = true
      ascSortedLevels.forEach((value, index) => {
        if (index === 0) {
          prevValue = value
        } else {
          const diff = value - prevValue
          if (diff < 1 || diff > 3) {
            include = false
          }
          prevValue = value
        }
      })
      if (include) {
        total++
      }
    }
  })

  // 483
  return total
}
