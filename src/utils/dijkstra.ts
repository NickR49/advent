import { getGridCell, Grid } from './gridUtils'

export function dijkstra(
  graph: Record<string, Record<string, number>>,
  start: string,
  end: string,
): string[] {
  let distances: Record<string, number> = {}
  let previous: Record<string, string | null> = {}
  let unvisited: Set<string> = new Set()

  for (let node in graph) {
    distances[node] = node === start ? 0 : Infinity
    previous[node] = null
    unvisited.add(node)
  }

  while (unvisited.size) {
    let closestNode: string | null = null
    for (let node of unvisited) {
      if (closestNode === null || distances[node] < distances[closestNode]) {
        closestNode = node
      }
    }

    if (closestNode === null || distances[closestNode] === Infinity) break
    if (closestNode === end) break

    for (let neighbor in graph[closestNode]) {
      let newDistance = distances[closestNode] + graph[closestNode][neighbor]
      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance
        previous[neighbor] = closestNode
      }
    }

    unvisited.delete(closestNode)
  }

  let path: string[] = []
  let node: string | null = end
  while (node) {
    path.push(node)
    node = previous[node]
  }

  return path.reverse()
}

export type Graph = Record<string, Record<string, number>>

export function createGraphFromMaze(maze: Grid): {
  graph: Graph
  start: string
  end: string
} {
  const graph: Graph = {}
  const rows = maze.height
  const cols = maze.width
  let start = ''
  let end = ''

  const getNodeKey = (row: number, col: number) => `${row},${col}`

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = getGridCell(maze, [row, col])
      if (cell === '#') continue

      const nodeKey = getNodeKey(row, col)
      graph[nodeKey] = {}

      if (cell === 'S') start = nodeKey
      if (cell === 'E') end = nodeKey

      const directions = [
        [0, 1], // right
        [1, 0], // down
        [0, -1], // left
        [-1, 0], // up
      ]

      for (const [dr, dc] of directions) {
        const newRow = row + dr
        const newCol = col + dc
        if (
          newRow >= 0 &&
          newRow < rows &&
          newCol >= 0 &&
          newCol < cols &&
          getGridCell(maze, [newRow, newCol]) !== '#'
        ) {
          const neighborKey = getNodeKey(newRow, newCol)
          graph[nodeKey][neighborKey] = 1
        }
      }
    }
  }

  return { graph, start, end }
}
