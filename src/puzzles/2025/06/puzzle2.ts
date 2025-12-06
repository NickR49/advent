import { getGrid, getGridCell, Grid } from '~/utils/gridUtils'
import { log } from '~/utils/log'
import data from './input.txt?raw'
export { default } from './puzzle2.ts?raw'

export let grid: Grid

interface Equation {
  numbers: number[]
  operator: Operator
}

type Operator = '+' | '*'

export function answer() {
  grid = getGrid(data)

  let total = 0

  try {
    const numberRowCount = grid.height - 1
    const operatorRowIndex = grid.height - 1
    let currentColumn = 0
    const equations: Equation[] = []
    let firstNumberColumn = true
    let numbers: number[] = []
    let operator: Operator

    // Extract equations column by column
    while (currentColumn < grid.width) {
      // Capture operator if first number column
      if (firstNumberColumn) {
        operator = getGridCell(grid, [
          currentColumn,
          operatorRowIndex,
        ]) as Operator
      }
      // Capture operands
      let numberAsString = ''
      for (let row = 0; row < numberRowCount; row++) {
        const cellValue = getGridCell(grid, [currentColumn, row])
        numberAsString += cellValue
      }
      const columnNumber = Number(numberAsString)
      if (columnNumber > 0) {
        numbers.push(columnNumber)
        firstNumberColumn = false
      } else {
        equations.push({ numbers, operator: operator! })
        numbers = []
        firstNumberColumn = true
      }
      currentColumn++
    }
    equations.push({ numbers, operator: operator! })

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

export const confirmedAnswer = 8843673199391
