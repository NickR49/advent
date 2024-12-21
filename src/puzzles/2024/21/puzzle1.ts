import {
  calcCoord,
  Coord,
  findCell,
  getGrid,
  getGridCell,
  Grid,
  isEqualCoord,
  printGrid,
} from '~/utils/gridUtils'
import { log } from '~/utils/log'
import moduleText from './puzzle1.ts?raw'
import data from './sample.txt?raw'

const numPadRaw = `789
456
123
 0A`
const numPadGrid = getGrid(numPadRaw)
printGrid(numPadGrid)

const dirPadRaw = ` ^A
<v>`
const dirPadGrid = getGrid(dirPadRaw)
printGrid(dirPadGrid)

// This avoids ever positioning over the space
function movesToChar(
  pad: Grid,
  pos: Coord,
  char: string,
): { moves: string; pos: Coord } {
  let moves = ''
  let currPos: Coord = [...pos]
  const charPos = findCell(pad, char) as Coord
  if (isEqualCoord(charPos, currPos)) {
    return {
      moves: '',
      pos: currPos,
    }
  }
  const dx = charPos[0] > pos[0] ? 1 : charPos[0] < pos[0] ? -1 : 0
  const dy = charPos[1] > pos[1] ? 1 : charPos[1] < pos[1] ? -1 : 0

  while (!isEqualCoord(currPos, charPos)) {
    if (Math.random() > 0.5) {
      // Move vert
      if (currPos[1] !== charPos[1]) {
        const possPos = calcCoord(currPos, [0, dy])
        if (getGridCell(pad, possPos) !== ' ') {
          currPos = possPos
          moves += dy === -1 ? '^' : 'v'
        }
      }
    } else {
      // Move horiz
      if (currPos[0] !== charPos[0]) {
        const possPos = calcCoord(currPos, [dx, 0])
        if (getGridCell(pad, possPos) !== ' ') {
          currPos = possPos
          moves += dx === -1 ? '<' : '>'
        }
      }
    }
  }

  return { moves, pos: charPos }
}

// Direction pad to numpad
function dpToNp(
  numPad: string,
  startPos: Coord,
): { moves: string; pos: Coord } {
  let currPos: Coord = [...startPos]
  let allMoves = ''
  numPad.split('').forEach((char) => {
    const { moves, pos } = movesToChar(numPadGrid, currPos, char)
    allMoves += moves + 'A'
    currPos = pos
  })
  return { moves: allMoves, pos: currPos }
}

// Direction page to direction pad
function dpToDp(
  dirPad: string,
  startPos: Coord,
): { moves: string; pos: Coord } {
  let currPos: Coord = [...startPos]
  let allMoves = ''
  dirPad.split('').forEach((char) => {
    const { moves, pos } = movesToChar(dirPadGrid, currPos, char)
    allMoves += moves + 'A'
    currPos = pos
  })
  return { moves: allMoves, pos: currPos }
}

export function answer() {
  const startTime = new Date().getTime()
  let total = 0

  try {
    let npPos: Coord = [2, 3]
    let dpPos1: Coord = [2, 0]
    let dpPos2: Coord = [2, 0]
    let dpPos3: Coord = [2, 0]
    // const npEntries = ['029A', '980A', '179A', '456A', '379A']
    const npEntries = ['341A', '083A', '802A', '973A', '780A']
    const lowestResults: number[] = [999, 999, 999, 999, 999]
    for (let i = 0; i < 10000; i++) {
      npEntries.forEach((npEntry, index) => {
        const dpEntry1 = dpToNp(npEntry, npPos)
        const dpEntry2 = dpToDp(dpEntry1.moves, dpPos1)
        const dpEntry3 = dpToDp(dpEntry2.moves, dpPos2)
        if (dpEntry3.moves.length < lowestResults[index]) {
          lowestResults[index] = dpEntry3.moves.length
        }
      })
    }

    log(JSON.stringify(lowestResults))
    lowestResults.forEach((result, index) => {
      const codeComplexity = Number(npEntries[index].slice(0, 3)) * result
      total += codeComplexity
    })
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }
  log(`Result: ${total}`)
  const endTime = new Date().getTime()
  log(`Time to run: ${endTime - startTime}ms`)
  return total
}

answer()

export const confirmedAnswer = 203814
// export default moduleText
