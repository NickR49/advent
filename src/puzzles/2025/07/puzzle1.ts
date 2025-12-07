import {
  Coord,
  findCell,
  getGrid,
  getGridCell,
  Grid,
  markGridCell,
  setGridCell,
} from '~/utils/gridUtils'
import { log } from '~/utils/log'
import data from './input.txt?raw'
export { default } from './puzzle1.ts?raw'

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
      return null
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

function countNodes(
  node: BeamNode | null,
  visited = new Set<BeamNode>(),
): number {
  if (!node || visited.has(node)) {
    return 0
  }
  visited.add(node)
  let count = 1 // Count this node
  for (const child of node.children) {
    count += countNodes(child, visited)
  }
  return count
}

export function answer() {
  grid = getGrid(data)

  let total = 0

  try {
    const startCoord = findCell(grid, 'S')
    if (!startCoord) {
      throw new Error('Start coordinate not found')
    }
    setGridCell(grid, startCoord, '|')
    const nodeCache = new Map<string, BeamNode>()
    const tree = findNextNode(grid, startCoord, nodeCache)
    total = countNodes(tree)
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

answer()

export const confirmedAnswer = 1504
