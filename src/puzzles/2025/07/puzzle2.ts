import {
  Coord,
  findCell,
  getGrid,
  getGridCell,
  Grid,
  markGridCell,
} from '~/utils/gridUtils'
import { log } from '~/utils/log'
import data from './input.txt?raw'
export { default } from './puzzle2.ts?raw'

export let grid: Grid

interface BeamNode {
  coord: Coord
  children: BeamNode[]
}

function findNextNode(
  grid: Grid,
  startCoord: Coord,
  nodeCache: Map<string, BeamNode>,
): BeamNode | null {
  let [col, row] = startCoord
  while (true) {
    row++
    const nextCellDown = getGridCell(grid, [col, row])
    if (nextCellDown === undefined) {
      const node: BeamNode = {
        coord: [col, row],
        children: [],
      }
      return node
    }
    if (nextCellDown === '.') {
      continue
    }
    if (nextCellDown === '^') {
      const key = `${col},${row}`
      if (nodeCache.has(key)) {
        return nodeCache.get(key)!
      }

      const node: BeamNode = {
        coord: [col, row],
        children: [],
      }
      nodeCache.set(key, node)
      markGridCell(grid, [col, row])
      const leftChild = findNextNode(grid, [col - 1, row], nodeCache)
      if (leftChild) {
        node.children.push(leftChild)
      }
      const rightChild = findNextNode(grid, [col + 1, row], nodeCache)
      if (rightChild) {
        node.children.push(rightChild)
      }
      return node
    }
    break
  }
  return null
}

function countPaths(
  node: BeamNode | null,
  memo = new Map<BeamNode, number>(),
): number {
  if (node === null) {
    return 0
  }
  if (memo.has(node)) {
    return memo.get(node)!
  }
  if (node.children.length === 0) {
    return 1
  }
  let totalPaths = 0
  for (const child of node.children) {
    totalPaths += countPaths(child, memo)
  }
  memo.set(node, totalPaths)
  return totalPaths
}

export function answer() {
  grid = getGrid(data)

  let total = 0

  try {
    const startCoord = findCell(grid, 'S')
    if (!startCoord) {
      throw new Error('Start coordinate not found')
    }
    const nodeCache = new Map<string, BeamNode>()
    const tree = findNextNode(grid, startCoord, nodeCache)
    total = countPaths(tree)
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

answer()

export const confirmedAnswer = 5137133207830
