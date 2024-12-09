import { Coord } from '~/utils/gridUtils'
import data from './input.txt?raw'
import moduleText from './puzzle1.ts?raw'
export { moduleText }

const map = data.split('\n')
const mapCopy = data.split('\n')
const height = map.length
const width = map[0].length

const nodeChars =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

// Take note of how many nodes there are for each letter/number
function getNodeCounts(): { [char: string]: number } {
  const nodeCounts: { [char: string]: number } = {}
  for (let i = 0; i < data.length; i++) {
    const char = data.slice(i, i + 1)
    if (nodeChars.includes(char)) {
      nodeCounts[char] = (nodeCounts[char] ?? 0) + 1
    }
  }
  return nodeCounts
}

function findNodes(char: string, count: number): Coord[] {
  const coords: Coord[] = []
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (map[y].slice(x, x + 1) === char) {
        coords.push([x, y])
      }
      if (coords.length === count) {
        return coords
      }
    }
  }
  return coords
}

function printCoord([x, y]: Coord) {
  return `[${x}, ${y}]`
}

function printMap() {
  console.log('----------------------')
  mapCopy.forEach((line) => console.log(line))
}

function isInMap([x, y]: Coord) {
  return x >= 0 && x < width && y >= 0 && y < height
}

function setChar([x, y]: Coord, char: string) {
  const line = mapCopy[y]
  mapCopy[y] = line.substring(0, x) + char + line.substring(x + 1)
}

function calcAntinode(
  [coord1X, coord1Y]: Coord,
  [coord2X, coord2Y]: Coord,
): Coord {
  const xDist = coord1X - coord2X
  const yDist = coord1Y - coord2Y
  return [coord1X + xDist, coord1Y + yDist]
}

const uniqueLocations: Coord[] = []

function isCoordEqual(coord1: Coord, coord2: Coord) {
  const [x1, y1] = coord1
  const [x2, y2] = coord2
  return x1 === x2 && y1 === y2
}

function addUniqueLocation(coord: Coord) {
  for (let i = 0; i < uniqueLocations.length; i++) {
    if (isCoordEqual(coord, uniqueLocations[i])) {
      return
    }
  }
  uniqueLocations.push(coord)
}

function calcAndAdd(coord1: Coord, coord2: Coord) {
  const antinode1 = calcAntinode(coord1, coord2)
  if (isInMap(antinode1)) {
    setChar(antinode1, '#')
    addUniqueLocation(antinode1)
  }
}

function findAntinodes(coords: Coord[]) {
  // For each combination of the nodes find two antinodes
  for (let i = 0; i < coords.length - 1; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      calcAndAdd(coords[i], coords[j])
      calcAndAdd(coords[j], coords[i])
    }
  }

  // printMap()
}

export function answer() {
  let total = 0

  try {
    // printMap()

    // Take note of how many nodes there are for each letter/number
    const nodeCounts = getNodeCounts()

    Object.entries(nodeCounts).forEach(([char, count]) => {
      const coords = findNodes(char, count)
      findAntinodes(coords)
    })
    total = uniqueLocations.length

    // printMap()
  } catch (e) {
    console.log(`Error: ${e}`)
  }

  return total
}

export const confirmedAnswer = 390
