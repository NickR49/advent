import { getLines } from '~/utils/lineUtils'
import { log } from '~/utils/log'
import data from './input.txt?raw'
export { default } from './puzzle1.ts?raw'

const CLOSEST_CONNECTIONS = 1000

let lines: string[]

interface Coord {
  x: number
  y: number
  z: number
}

interface Edge {
  u: number // Index of first box
  v: number // Index of second box
  distance: number
  used?: boolean
}

interface Circuit {
  id: number
  nodes: Coord[]
}

function getDist(a: Coord, b: Coord): number {
  return Math.sqrt(
    Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2),
  )
}

function mergeCircuits(circuits: Circuit[], nodeA: Coord, nodeB: Coord): void {
  let circuitA: Circuit | null = null
  let circuitB: Circuit | null = null

  for (const circuit of circuits) {
    if (circuit.nodes.includes(nodeA)) {
      circuitA = circuit
    }
    if (circuit.nodes.includes(nodeB)) {
      circuitB = circuit
    }
    if (circuitA && circuitB) {
      break
    }
  }

  if (circuitA && circuitB && circuitA !== circuitB) {
    // Merge circuitB into circuitA
    circuitA.nodes.push(...circuitB.nodes)
    // Remove circuitB from circuits
    const index = circuits.indexOf(circuitB)
    if (index !== -1) {
      circuits.splice(index, 1)
    }
  }
}

// function logPair(coord1: Coord, coord2: Coord) {
//   log(
//     `Pair: (${coord1.x},${coord1.y},${coord1.z}) <-> (${coord2.x},${coord2.y},${coord2.z})`,
//   )
// }

export function answer() {
  lines = getLines(data)
  let total = 0
  let connections = 0
  const circuits: Circuit[] = []

  try {
    const nodes: Coord[] = lines.map((line) => {
      const [xStr, yStr, zStr] = line.split(',')
      return {
        x: parseInt(xStr, 10),
        y: parseInt(yStr, 10),
        z: parseInt(zStr, 10),
      }
    })
    // Initialize each node as its own circuit
    nodes.forEach((node, index) => {
      circuits.push({
        id: index,
        nodes: [node],
      })
    })

    // Get all possible edges
    const edges: Edge[] = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        edges.push({
          u: i,
          v: j,
          distance: getDist(nodes[i], nodes[j]),
        })
      }
    }

    edges.sort((a, b) => a.distance - b.distance)

    // Get the ten shortest connections
    while (connections < CLOSEST_CONNECTIONS) {
      const nextClosestEdge = edges.find((edge) => !edge.used)
      if (!nextClosestEdge) {
        break
      }
      nextClosestEdge.used = true
      connections++
      const nodeA = nodes[nextClosestEdge.u]
      const nodeB = nodes[nextClosestEdge.v]
      mergeCircuits(circuits, nodeA, nodeB)
      // logPair(nodeA, nodeB)
    }

    const threeLongestCircuits = circuits
      .sort((a, b) => b.nodes.length - a.nodes.length)
      .slice(0, 3)

    total =
      threeLongestCircuits[0].nodes.length *
      threeLongestCircuits[1].nodes.length *
      threeLongestCircuits[2].nodes.length
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

answer()

export const confirmedAnswer = 57970
