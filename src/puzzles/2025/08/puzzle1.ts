import { Coord3D, Edge } from '~/utils/3dUtils'
import { getLines } from '~/utils/lineUtils'
import { log } from '~/utils/log'
import data from './input.txt?raw'
export { default } from './puzzle1.ts?raw'

export let nodes: Coord3D[] = []
export let edges: Edge[] = []

const CLOSEST_CONNECTIONS = 1000

let lines: string[]

interface Circuit {
  id: number
  nodes: Coord3D[]
}

function getDist(a: Coord3D, b: Coord3D): number {
  return Math.sqrt(
    Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2),
  )
}

function mergeCircuits(
  circuits: Circuit[],
  nodeA: Coord3D,
  nodeB: Coord3D,
): boolean {
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
    return true
  } else {
    return false
  }
}

export function answer() {
  lines = getLines(data)
  let total = 0
  let connections = 0
  const circuits: Circuit[] = []

  try {
    nodes = lines.map((line) => {
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
    edges = []
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

    // Get the shortest connections
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
