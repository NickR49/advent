import { log } from '~/utils/log'
export { default } from './puzzle1.ts?raw'

function splitNum(value: number): number[] {
  const str = String(value)
  return [
    Number(str.slice(0, str.length / 2)),
    Number(str.slice(str.length / 2, str.length)),
  ]
}

function blink(inputNumbers: number[]): number[] {
  const outputNumbers: number[] = []
  inputNumbers.forEach((number) => {
    if (number === 0) {
      outputNumbers.push(1)
    } else if (String(number).length % 2 === 0) {
      outputNumbers.push(...splitNum(number))
    } else {
      outputNumbers.push(number * 2024)
    }
  })
  return outputNumbers
}

export function answer() {
  // let line = '125 17'
  let line = '8069 87014 98 809367 525 0 9494914 5'
  let numbers = line.split(' ').map(Number)
  try {
    for (let i = 0; i < 25; i++) {
      numbers = blink(numbers)
    }
  } catch (e) {
    log(`Error: ${e}`)
  }

  return numbers.length
}

export const confirmedAnswer = 183484
