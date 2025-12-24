import { getLines } from '~/utils/lineUtils'
import { log } from '~/utils/log'

import data from './input.txt?raw'
export { default } from './puzzle1.ts?raw'

let lines: string[]

interface Equation {
  numbers: number[]
  operator: Operator
}

type Operator = '+' | '*'

export function answer(): number {
  lines = getLines(data)

  let total = 0

  try {
    const numbers = lines
      .slice(0, lines.length - 1)
      .map((line) => line.trim().split(/\s+/))
      .map((values) => values.map((v) => Number(v)))
    const operators = lines[lines.length - 1].split(/\s+/)
    const equations: Equation[] = []

    for (let i = 0; i < operators.length; i++) {
      const numberSet: number[] = []
      for (let j = 0; j < numbers.length; j++) {
        numberSet.push(numbers[j][i])
      }
      const operator = operators[i] as Operator
      equations.push({ numbers: numberSet, operator })
    }

    equations.forEach((equation) => {
      switch (equation.operator) {
        case '+':
          total += equation.numbers.reduce((a, b) => a + b, 0)
          break
        case '*':
          total += equation.numbers.reduce((a, b) => a * b, 1)
          break
      }
    })
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

answer()

export const confirmedAnswer = 5524274308182
