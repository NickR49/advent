import data from './input.txt?raw'

interface SchematicAster {
  x: number
  y: number
  values: number[]
}

function gobbleLeft(line: string, x: number): string {
  let result = ''
  for (let i = x - 1; i >= 0; i--) {
    if (line.charAt(i).match(/[0-9]/)) {
      result = line.charAt(i) + result
    } else {
      break
    }
  }
  return result
}

function gobbleRight(line: string, x: number): string {
  let result = ''
  for (let i = x + 1; i < line.length; i++) {
    if (line.charAt(i).match(/[0-9]/)) {
      result = result + line.charAt(i)
    } else {
      break
    }
  }
  return result
}

function gobbleNumbers(line: string, x: number): string[] {
  const results: string[] = []
  if (line.charAt(x).match(/[0-9]/)) {
    const left = gobbleLeft(line, x)
    const right = gobbleRight(line, x)
    results.push(left + line.charAt(x) + right)
  } else {
    if (x > 0 && line.charAt(x - 1).match(/[0-9]/)) {
      results.push(gobbleLeft(line, x))
    }
    if (x < line.length - 1 && line.charAt(x + 1).match(/[0-9]/)) {
      results.push(gobbleRight(line, x))
    }
  }
  return results
}

const numberRegex = /[0-9]+/

function findAdjacentNumbers(
  allLines: string[],
  aster: SchematicAster,
): SchematicAster {
  // Check the line above
  if (aster.y > 0) {
    const lineAbove = allLines[aster.y - 1]
    const results = gobbleNumbers(lineAbove, aster.x)
    results.forEach((result) => aster.values.push(parseInt(result, 10)))
  }
  // Check the line below
  if (aster.y < allLines.length - 1) {
    const lineBelow = allLines[aster.y + 1]
    const results = gobbleNumbers(lineBelow, aster.x)
    results.forEach((result) => aster.values.push(parseInt(result, 10)))
  }
  const currentLine = allLines[aster.y]
  // Check to the left
  if (aster.x > 0) {
    const result = gobbleLeft(currentLine, aster.x)
    if (result) {
      aster.values.push(parseInt(result, 10))
    }
  }
  // Check to the right
  if (aster.x < currentLine.length - 1) {
    const result = gobbleRight(currentLine, aster.x)
    if (result) {
      aster.values.push(parseInt(result, 10))
    }
  }

  return aster
}

export function answer() {
  let total = 0
  const asters: SchematicAster[] = []

  // Find all asters in the input and store in an array with their coordinates
  data.split('\n').forEach((line, y) => {
    const matches = line.matchAll(/\*/g)
    for (const match of matches) {
      asters.push({
        x: match.index,
        y,
        values: [],
      })
    }
  })

  // Iterate through each aster and check for adjacent numbers
  const allLines: string[] = data.split('\n')
  asters
    .map((aster) => findAdjacentNumbers(allLines, aster))
    .forEach((aster) => {
      console.log(`Aster at ${aster.y}, ${aster.x} has values: ${aster.values}`)
      if (aster.values.length === 2) {
        total += aster.values[0] * aster.values[1]
      }
    })

  // 91622824
  return total
}
