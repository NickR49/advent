import data from './input.txt?raw'
export { default } from './puzzle2.ts?raw'

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

function findFile(
  input: Entry[],
  fileId: number
): [position: number, size: number] {
  const pos = input.findIndex((entry) => entry === fileId)
  const size = input.filter((entry) => entry === fileId).length
  return [pos, size]
}

function findFirstGap(input: Entry[], size: number): number {
  let pos = -1
  let index = 0
  let sizeCounter = 0
  while (index < input.length) {
    if (input[index] === undefined) {
      sizeCounter++
      if (sizeCounter === size) {
        return pos
      }
    } else {
      sizeCounter = 0
      pos = index + 1
    }
    index++
  }
  return -1
}

function printFileSystem(input: Entry[]) {
  console.log(
    input.map((entry) => (entry === undefined ? '.' : `${entry}`)).join('')
  )
}

// 00...111...2...333.44.5555.6666.777.888899 => 00992111777.44.333....5555.6666.....8888..
function moveFiles(input: Entry[]): Entry[] {
  const nums = input.filter((value) => value !== undefined)
  let currentFileId: Entry = Math.max(...nums)

  // Find next file
  while (currentFileId >= 0) {
    const [filePos, fileSize] = findFile(input, currentFileId)
    const gapPos = findFirstGap(input, fileSize)
    if (gapPos >= 0 && gapPos < filePos) {
      // Move the file
      for (let i = gapPos; i < gapPos + fileSize; i++) {
        input[i] = currentFileId
      }
      for (let i = filePos; i < filePos + fileSize; i++) {
        input[i] = undefined
      }
    }
    currentFileId--
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

export function answer(): number {
  let total = 0

  try {
    const line = data.trim()
    const convertedLine = convertLine(line)
    const defragged = moveFiles(convertedLine)
    total = calcChecksum(defragged)
  } catch (e) {
    console.log(`Error: ${e}`)
  }

  return total
}

export const confirmedAnswer = 6379677752410
