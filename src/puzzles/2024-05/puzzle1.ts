import { isEqual } from 'lodash'
import data from './input.txt?raw'
import moduleText from './puzzle1.ts?raw'
export { moduleText }

interface PageOrderingRule {
  first: number
  second: number
}

type Update = number[]

export function answer() {
  let total = 0

  try {
    const lines = data.split('\n')
    const pageOrderingRules: PageOrderingRule[] = []
    const pageUpdates: Update[] = []

    lines.forEach((line) => {
      if (line.includes('|')) {
        const pages = line.split('|').map((page) => parseInt(page, 10))
        pageOrderingRules.push({ first: pages[0], second: pages[1] })
      } else if (line.includes(',')) {
        const updates = line.split(',').map((page) => parseInt(page, 10))
        pageUpdates.push(updates)
      }
    })

    pageUpdates.forEach((pageUpdate) => {
      // Get all relevant page ordering rules
      const rules = pageOrderingRules.filter(
        (rule) =>
          pageUpdate.includes(rule.first) && pageUpdate.includes(rule.second),
      )

      // Establish order - using the assumption that the number of times a number occurs in the first position indicates its position
      const counter: { [key: number]: number } = {}
      pageUpdate.forEach((update) => (counter[update] = 0))
      rules.forEach((rule) => (counter[rule.first] += 1))
      const correctOrder = Object.entries(counter)
        .sort(([keyA, valueA], [keyB, valueB]) => valueB - valueA)
        .map(([key, value]) => parseInt(key, 10))

      // Determine if the supplied order is the correct order
      if (isEqual(pageUpdate, correctOrder)) {
        // If so get middle number and add to total
        const middleIndex = (pageUpdate.length - 1) / 2
        total += pageUpdate[middleIndex]
      }
    })
  } catch (e) {
    console.log(`Error: ${e}`)
  }

  // 7074
  return total
}