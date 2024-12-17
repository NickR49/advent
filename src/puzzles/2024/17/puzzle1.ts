import { log } from '~/utils/log'
import data from './input.txt?raw'
import moduleText from './puzzle1.ts?raw'
export { moduleText }

let [A, B, C] = data
  .split('\n\n')[0]
  .split('\n')
  .map((line) => line.match(/(\d+)/))
  .map((match) => (match ? Number(match[1]) : 0))

const program = data.split('\n\n')[1].split(' ')[1].split(',').map(Number)

log(`Program: ${JSON.stringify(program)}`)

function getComboOperandValue(operand: number): number {
  if (operand >= 0 && operand <= 3) {
    return operand
  }
  if (operand === 4) {
    return A
  }
  if (operand === 5) {
    return B
  }
  if (operand === 6) {
    return C
  }
  return 7
}

export function answer() {
  const result: number[] = []

  try {
    let i = 0
    while (true) {
      const operator = program[i]
      const operand = program[i + 1]
      const comboOperandValue = getComboOperandValue(operand)
      // log(`i: ${i}, A: ${A}, B: ${B}, C: ${C}`)
      // log(
      //   `Operator: ${operator}, Operand: ${operand}, Combo Operand: ${comboOperandValue}`,
      // )
      switch (operator) {
        // adv - division
        case 0:
          A = A >> comboOperandValue
          i += 2
          break
        // bxl - bitwise XOR
        case 1:
          B = B ^ operand
          i += 2
          break
        // bst - modulo
        case 2:
          B = comboOperandValue % 8
          // B = comboOperandValue & 7
          i += 2
          break
        // jnz
        case 3:
          if (A === 0) {
            i += 2
          } else {
            i = operand
          }
          break
        // bxc
        case 4:
          B = B ^ C
          i += 2
          break
        // out
        case 5:
          const output = comboOperandValue % 8
          // const output = comboOperandValue & 7
          result.push(output)
          i += 2
          break
        // bdv
        case 6:
          B = A >> comboOperandValue
          i += 2
          break
        // cdv
        case 7:
          C = A >> comboOperandValue
          i += 2
          break
      }
      if (i < 0 || i >= program.length) {
        break
      }
    }
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return result.map((num) => `${num}`).join(',')
}

export const confirmedAnswer = '2,1,0,4,6,2,4,2,0'
