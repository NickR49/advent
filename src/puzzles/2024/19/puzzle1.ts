import { log } from '~/utils/log'
import data from './input.txt?raw'
export { default } from './puzzle1.ts?raw'

const patterns = data.split('\n\n')[0].split(', ')
const towelsToMake = data.split('\n\n')[1].split('\n')

// TIL - dynamic programming
function canMakeTowel1(towelToMake: string, patterns: string[]): boolean {
  const dp: boolean[] = Array(towelToMake.length + 1).fill(false)
  dp[0] = true // Empty string gets a free pass

  for (let i = 1; i <= towelToMake.length; i++) {
    for (const pattern of patterns) {
      const patternFits = i >= pattern.length
      const prefixCanBeMatched = dp[i - pattern.length]
      const patternMatches =
        towelToMake.substring(i - pattern.length, i) === pattern
      if (patternFits && prefixCanBeMatched && patternMatches) {
        dp[i] = true
        // break
      }
    }
  }

  return dp[towelToMake.length]
}

function canMakeTowel2(towelToMake: string, patterns: string[]): boolean {
  const dp: boolean[] = new Array(towelToMake.length + 1).fill(false)
  dp[0] = true // Empty string gets a free pass
  for (let i = 0; i <= towelToMake.length; i++) {
    if (dp[i]) {
      for (const pattern of patterns) {
        const patternFits = i + pattern.length <= towelToMake.length
        const patternMatches =
          towelToMake.slice(i, i + pattern.length) === pattern
        if (patternFits && patternMatches) {
          dp[i + pattern.length] = true
        }
      }
    }
  }

  return dp[towelToMake.length]
}

export function answer() {
  let total = 0

  try {
    towelsToMake.forEach((towel) => {
      if (canMakeTowel1(towel, patterns)) {
        total++
      }
    })
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

export const confirmedAnswer = 347
