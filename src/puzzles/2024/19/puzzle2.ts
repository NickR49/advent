import { log } from '~/utils/log'
import data from './input.txt?raw'
export { default } from './puzzle2.ts?raw'

const patterns = data.split('\n\n')[0].split(', ')
const towelsToMake = data.split('\n\n')[1].split('\n')

const findPatternCombinations = (
  towelToMake: string,
  patterns: string[],
): number => {
  const dp: number[] = new Array(towelToMake.length + 1).fill(0)
  dp[0] = 1 // Empty string gets a free pass
  for (let i = 0; i <= towelToMake.length; i++) {
    if (dp[i]) {
      for (const pattern of patterns) {
        const patternFits = i + pattern.length <= towelToMake.length
        const patternMatches =
          towelToMake.slice(i, i + pattern.length) === pattern
        if (patternFits && patternMatches) {
          dp[i + pattern.length] += dp[i]
        }
      }
    }
  }

  return dp[towelToMake.length]
}

export function answer() {
  let total = 0

  try {
    towelsToMake.forEach((towel, index) => {
      log(`Checking towel ${index}`)
      const combos = findPatternCombinations(towel, patterns)
      total += combos
    })
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

export const confirmedAnswer = 919219286602165
