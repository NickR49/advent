import data from './input.txt?raw'
export { default } from './puzzle1.ts?raw'

export function answer() {
  let total = 0
  const maxRed = 12
  const maxGreen = 13
  const maxBlue = 14

  data.split('\n').forEach((line) => {
    const gameNumber = parseInt(line.match(/Game (\d+)/)![1])
    let includeGame = true
    // Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
    const lineAfterColon = line.split(': ')[1]
    const rounds = lineAfterColon.split('; ')
    for (const round of rounds) {
      const colors = round.split(', ')
      for (const color of colors) {
        const [count, colorName] = color.split(' ')
        if (colorName === 'red' && parseInt(count) > maxRed) {
          includeGame = false
          break
        }
        if (colorName === 'green' && parseInt(count) > maxGreen) {
          includeGame = false
          break
        }
        if (colorName === 'blue' && parseInt(count) > maxBlue) {
          includeGame = false
          break
        }
      }
    }
    if (includeGame) {
      total += gameNumber
    }
  })
  return total
}

export const confirmedAnswer = 2237
