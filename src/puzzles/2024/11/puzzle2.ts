import { log } from '~/utils/log'
export { default } from './puzzle2.ts?raw'

function splitNum(value: number): number[] {
  const str = String(value)
  return [
    Number(str.slice(0, str.length / 2)),
    Number(str.slice(str.length / 2, str.length)),
  ]
}

function blink(inputNumbers: Map<number, number>): Map<number, number> {
  const outputNumbers = new Map<number, number>()
  inputNumbers.forEach((count, number) => {
    if (number === 0) {
      outputNumbers.set(1, (outputNumbers.get(1) || 0) + count)
    } else if (String(number).length % 2 === 0) {
      const [a, b] = splitNum(number)
      outputNumbers.set(a, (outputNumbers.get(a) || 0) + count)
      outputNumbers.set(b, (outputNumbers.get(b) || 0) + count)
    } else {
      outputNumbers.set(
        number * 2024,
        (outputNumbers.get(number * 2024) || 0) + count,
      )
    }
  })
  return outputNumbers
}

export function answer() {
  // let line = '125 17' // sample
  let line = '8069 87014 98 809367 525 0 9494914 5'
  let numbers = line.split(' ').map(Number)

  // Keep a track of many times each number occurs
  let numberMap = new Map<number, number>(numbers.map((n) => [n, 1]))

  try {
    for (let i = 0; i < 75; i++) {
      numberMap = blink(numberMap)
    }
  } catch (e) {
    log(`Error: ${e}`)
  }

  return Array.from(numberMap.values()).reduce((acc, count) => acc + count, 0)
}

export const confirmedAnswer = 218817038947400
