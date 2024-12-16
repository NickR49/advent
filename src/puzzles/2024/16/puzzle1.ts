import { getGrid, getGridCell, Grid } from '~/utils/gridUtils'
import { log } from '~/utils/log'
import data from './input.txt?raw'
import moduleText from './puzzle1.ts?raw'
export { moduleText }

const grid = getGrid(data)

type Graph = Record<
  string,
  Record<string, { cost: number; direction: Direction }>
>

type Direction = 'up' | 'down' | 'left' | 'right'

const directions: Record<Direction, [x: number, y: number]> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
}

function createGraphFromMaze(maze: Grid): {
  graph: Graph
  start: string
  end: string
} {
  const graph: Graph = {}
  let start = ''
  let end = ''

  const getNodeKey = (x: number, y: number) => `${x},${y}`

  for (let y = 0; y < maze.height; y++) {
    for (let x = 0; x < maze.width; x++) {
      const cell = getGridCell(maze, [x, y])
      if (cell === '#') continue

      const nodeKey = getNodeKey(x, y)
      graph[nodeKey] = {}

      if (cell === 'S') start = nodeKey
      if (cell === 'E') end = nodeKey

      for (const direction in directions) {
        const [dx, dy] = directions[direction as Direction]
        const newY = y + dy
        const newX = x + dx
        if (getGridCell(maze, [newX, newY]) !== '#') {
          const neighborKey = getNodeKey(newX, newY)
          graph[nodeKey][neighborKey] = {
            cost: 1,
            direction: direction as Direction,
          }
        }
      }
    }
  }

  return { graph, start, end }
}

// Thanks to https://www.youtube.com/watch?v=_D3uXve1lUo
function dijkstra(
  graph: Graph,
  startNode: string,
  endNode: string,
  startingDirection: Direction,
): { path: string[]; score: number } {
  const costs: Record<string, number> = {}
  const previous: Record<string, string | null> = {}
  const unvisited: Set<string> = new Set()
  const directionFrom: Record<string, Direction | null> = {}

  // Set distances for all nodes to infinity except the start node, and add all nodes to unvisited
  for (const node in graph) {
    costs[node] = node === startNode ? 0 : Infinity
    previous[node] = null
    directionFrom[node] = node === startNode ? startingDirection : null
    unvisited.add(node)
  }

  while (unvisited.size) {
    let closestNode: string | null = null
    // Find closest unvisited node (finds startNode first)
    for (const node of unvisited) {
      if (!closestNode || costs[node] < costs[closestNode]) {
        closestNode = node
      }
    }

    if (!closestNode || costs[closestNode] === Infinity) break
    if (closestNode === endNode) break

    for (const neighbour in graph[closestNode]) {
      const { cost, direction } = graph[closestNode][neighbour]
      const currentDirection = directionFrom[closestNode]
      const turnCost = currentDirection !== direction ? 1000 : 0
      const newCost = costs[closestNode] + cost + turnCost

      // Find lowest cost neighbour
      if (newCost < costs[neighbour]) {
        costs[neighbour] = newCost
        previous[neighbour] = closestNode
        directionFrom[neighbour] = direction
      }
    }

    unvisited.delete(closestNode)
  }

  const path: string[] = []
  let node: string | null = endNode
  while (node) {
    path.push(node)
    node = previous[node]
  }

  return { path: path.reverse(), score: costs[endNode] }
}

export function answer() {
  let total = 0

  try {
    const startTime = new Date().getTime()

    const { graph, start, end } = createGraphFromMaze(grid)
    const { score } = dijkstra(graph, start, end, 'right')

    const endTime = new Date().getTime()
    log(`Time to run: ${endTime - startTime}ms`)

    total = score
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

export const confirmedAnswer = 83432
export { grid }
