import data from './input.txt?raw'
export { default } from './puzzle1.ts?raw'

type Entry = number | undefined

// 2333133121414131402 => 00...111...2...333.44.5555.6666.777.888899
function convertLine(input: string): Entry[] {
  let output: Entry[] = []
  let isBlock = true
  let fileId = 0
  for (let i = 0; i < input.length; i++) {
    const count = parseInt(input.slice(i, i + 1))
    if (isBlock) {
      output.push(...Array(count).fill(fileId))
      fileId++
    } else {
      output.push(...Array(count).fill(undefined))
    }
    isBlock = !isBlock
  }
  return output
}

// 00...111...2...333.44.5555.6666.777.888899 => 0099811188827773336446555566..............
function moveBlocks(input: Entry[]): Entry[] {
  let startPos = 0
  let endPos = input.length
  let endPosNumber: Entry

  outer: while (startPos < endPos - 2) {
    // Find next block from end
    while (true) {
      endPosNumber = input[endPos]
      if (endPosNumber !== undefined) {
        break
      }
      endPos--
      if (endPos < 0) {
        break outer
      }
    }

    // Find next gap from start
    while (true) {
      if (input[startPos] === undefined) {
        break
      }
      startPos++
      if (startPos === input.length) {
        break outer
      }
    }

    // Swap the startPos and endPos values
    input[startPos] = endPosNumber
    input[endPos] = undefined
  }

  return input
}

function calcChecksum(input: Entry[]): number {
  let total = 0
  input.forEach((entry, index) => {
    if (entry !== undefined) {
      total += index * entry
    }
  })
  return total
}

export function answer() {
  let total = 0

  try {
    const line = data.trim()
    const convertedLine = convertLine(line)
    const defragged = moveBlocks(convertedLine)
    total = calcChecksum(defragged)
  } catch (e) {
    console.log(`Error: ${e}`)
  }

  return total
}

export const confirmedAnswer = 6360094256423
