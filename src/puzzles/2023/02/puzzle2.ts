import data from './input.txt?raw'
import moduleText from './puzzle2.ts?raw'

export function answer() {
  let total = 0

  data.split('\n').forEach((line) => {
    let maxRed = 0
    let maxGreen = 0
    let maxBlue = 0
    const gameNumber = parseInt(line.match(/Game (\d+)/)![1])
    // Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
    const lineAfterColon = line.split(': ')[1]
    const rounds = lineAfterColon.split('; ')
    for (const round of rounds) {
      const colors = round.split(', ')
      for (const color of colors) {
        const [count, colorName] = color.split(' ')
        if (colorName === 'red') {
          maxRed = Math.max(maxRed, parseInt(count))
        }
        if (colorName === 'green') {
          maxGreen = Math.max(maxGreen, parseInt(count))
        }
        if (colorName === 'blue') {
          maxBlue = Math.max(maxBlue, parseInt(count))
        }
      }
    }
    const gamePower = maxRed * maxGreen * maxBlue
    total += gamePower
  })
  // 66681
  return total
}

export default moduleText
