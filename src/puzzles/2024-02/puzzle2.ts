import { isEqual } from 'lodash'
import data from './input.txt?raw'

export function answer() {
  let total = 0

  console.log(`${data.split('\n').length} lines to process`)

  data.split('\n').forEach((report) => {
    const levels = report.split(' ').map((level) => parseInt(level, 10))

    for (let i = -1; i < levels.length; i++) {
      // Exclude item at index i of array
      const sliceLevels = i === -1 ? levels : levels.toSpliced(i, 1)

      const ascSortedLevels = sliceLevels.toSorted((a, b) => a - b)
      const descSortedLevels = ascSortedLevels.toReversed()
      if (
        isEqual(sliceLevels, ascSortedLevels) ||
        isEqual(sliceLevels, descSortedLevels)
      ) {
        // Check the levels increment by at least one and at most three
        let prevValue = 0
        let include = true
        sliceLevels.forEach((value, index) => {
          if (index === 0) {
            prevValue = value
          } else {
            const diff = Math.abs(value - prevValue)
            if (diff < 1 || diff > 3) {
              include = false
            }
            prevValue = value
          }
        })
        if (include) {
          total++
          i = levels.length + 1
          console.log(JSON.stringify(sliceLevels))
        }
      }
    }
  })

  // 528
  return total
}
