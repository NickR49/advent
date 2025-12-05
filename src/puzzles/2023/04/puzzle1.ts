import data from './input.txt?raw'
import moduleText from './puzzle1.ts?raw'

function getCardPoints(card: string): number {
  let matchingCards = 0
  const [left, right] = card.split(':')[1].split('|')
  const winningNumbers = left
    .trim()
    .split(' ')
    .map((n) => parseInt(n, 10))
    .filter((n) => !isNaN(n))
  const cardNumbers = right
    .trim()
    .split(' ')
    .map((n) => parseInt(n, 10))
    .filter((n) => !isNaN(n))
  winningNumbers.forEach((winningNumber) => {
    if (cardNumbers.includes(winningNumber)) {
      matchingCards++
    }
  })
  const points = matchingCards === 0 ? 0 : Math.pow(2, matchingCards - 1)
  return points
}

export function answer() {
  let total = 0
  data.split('\n').forEach((line) => {
    total += getCardPoints(line)
  })

  return total
}

export const confirmedAnswer = 23847
export default moduleText
