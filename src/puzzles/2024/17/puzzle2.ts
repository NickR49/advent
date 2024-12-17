import { log } from '~/utils/log'
import data from './input.txt?raw'
import moduleText from './puzzle2.ts?raw'
export { moduleText }

const programString = data.split('\n\n')[1].split(' ')[1]
const program = programString.split(',').map(Number)

log(`Program: ${JSON.stringify(program)}`)

function getComboOperandValue(
  operand: number,
  a: number,
  b: number,
  c: number,
): number {
  if (operand >= 0 && operand <= 3) {
    return operand
  }
  if (operand === 4) {
    return a
  }
  if (operand === 5) {
    return b
  }
  if (operand === 6) {
    return c
  }
  return 7
}

function getOutput(a: number, b: number, c: number): string {
  const result: number[] = []

  let i = 0
  while (true) {
    const operator = program[i]
    const operand = program[i + 1]
    const comboOperandValue = getComboOperandValue(operand, a, b, c)
    switch (operator) {
      // adv - division
      case 0:
        a = a >> comboOperandValue
        i += 2
        break
      // bxl - bitwise XOR
      case 1:
        b = b ^ operand
        i += 2
        break
      // bst - modulo
      case 2:
        // b = comboOperandValue % 8
        b = comboOperandValue & 7
        i += 2
        break
      // jnz
      case 3:
        if (a === 0) {
          i += 2
        } else {
          i = operand
        }
        break
      // bxc
      case 4:
        b = b ^ c
        i += 2
        break
      // out
      case 5:
        // const output = comboOperandValue % 8
        const output = comboOperandValue & 7
        result.push(output)
        i += 2
        break
      // bdv
      case 6:
        b = a >> comboOperandValue
        i += 2
        break
      // cdv
      case 7:
        c = a >> comboOperandValue
        i += 2
        break
    }
    if (i < 0 || i >= program.length) {
      break
    }
  }
  return result.map((num) => `${num}`).join(',')
}
const million = 1000000
export function answer() {
  let result = 0
  try {
    // let a = 1100 * million
    let a = 0 * million
    while (true) {
      if (a % million === 0) {
        log(`Trying ${a / million} million . . .`)
      }
      const output = getOutput(a, 0, 0)
      if (output === programString) {
        log(`The solution is ${a}!!!!!`)
        result = a
        break
      }
      a++
    }
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return result
}

// export const confirmedAnswer =
