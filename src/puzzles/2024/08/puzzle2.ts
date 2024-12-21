import { cloneDeep } from 'lodash'
import {
  Coord,
  getGrid,
  getGridCell,
  isEqualCoord,
  isInGrid,
  setGridCell,
} from '~/utils/gridUtils'
import data from './input.txt?raw'
import moduleText from './puzzle2.ts?raw'

export const grid = getGrid(data)
const gridCopy = cloneDeep(grid)

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
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      if (getGridCell(grid, [x, y]) === char) {
        coords.push([x, y])
      }
      if (coords.length === count) {
        return coords
      }
    }
  }
  return coords
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

function addUniqueLocation(coord: Coord) {
  for (let i = 0; i < uniqueLocations.length; i++) {
    if (isEqualCoord(coord, uniqueLocations[i])) {
      return
    }
  }
  uniqueLocations.push(coord)
}

function calcAndAdd(coord1: Coord, coord2: Coord) {
  const antinode = calcAntinode(coord1, coord2)
  if (isInGrid(grid, antinode)) {
    setGridCell(gridCopy, antinode, '#') // For debug purposes
    addUniqueLocation(antinode)
    // Recursively search for more antinodes
    calcAndAdd(antinode, coord1)
  }
  return
}

function findAntinodes(coords: Coord[]) {
  // For each combination of the nodes find two antinodes
  for (let i = 0; i < coords.length - 1; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      calcAndAdd(coords[i], coords[j])
      calcAndAdd(coords[j], coords[i])
      addUniqueLocation(coords[i])
      addUniqueLocation(coords[j])
    }
  }
  // printGrid(gridCopy)
}

export function answer() {
  let total = 0

  try {
    // printGrid(gridCopy)

    // Take note of how many nodes there are for each letter/number
    const nodeCounts = getNodeCounts()

    Object.entries(nodeCounts).forEach(([char, count]) => {
      const coords = findNodes(char, count)
      findAntinodes(coords)
    })
    total = uniqueLocations.length

    // printGrid(gridCopy)
  } catch (e) {
    console.log(`Error: ${e}`)
  }

  return total
}

export const confirmedAnswer = 1246
export default moduleText
