import { getLines } from '~/utils/lineUtils'
import { log } from '~/utils/log'
import data from './input.txt?raw'
export { default } from './puzzle1.ts?raw'

let lines: string[]

interface Connections {
  inputDevice: string
  outputDevices: string[]
}

// Find all paths from device 'you' to device 'out'
function findPaths(
  graph: Record<string, string[]>,
  currentDevice: string,
  terminalDevice: string,
  visited: Set<string>,
): number {
  if (currentDevice === terminalDevice) {
    return 1 // Found a valid path
  }

  if (visited.has(currentDevice)) {
    return 0 // Avoid cycles
  }

  visited.add(currentDevice)
  let pathCount = 0

  const neighbors = graph[currentDevice] || []
  for (const neighbor of neighbors) {
    pathCount += findPaths(graph, neighbor, terminalDevice, new Set(visited))
  }

  return pathCount
}

export function answer() {
  lines = getLines(data)

  let total = 0

  try {
    const connections: Connections[] = lines.map((line) => {
      const [inputDevice, outputDevicesStr] = line.split(': ')
      const outputDevices = outputDevicesStr.split(' ')
      return { inputDevice, outputDevices }
    })

    // Construct a graph of the connections
    const graph: Record<string, string[]> = {}
    connections.forEach(({ inputDevice, outputDevices }) => {
      graph[inputDevice] = outputDevices
    })

    total = findPaths(graph, 'you', 'out', new Set())
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

answer()

// export const confirmedAnswer =
