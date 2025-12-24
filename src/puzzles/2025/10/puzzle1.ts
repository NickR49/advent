import { getLines } from '~/utils/lineUtils'
import { log } from '~/utils/log'

import data from './input.txt?raw'
export { default } from './puzzle1?raw'

let lines: string[]

type ButtonGroup = number[]

interface Machine {
  requiredLightPattern: string // '.' - off, '#' - on
  currentLightPattern: string
  buttonGroups: ButtonGroup[]
  joltage: number[]
}

// [.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
function parseMachine(line: string): Machine {
  // Required Indicator lights
  const lightPatternMatch = line.match(/^\[([.#]+)\]/)
  if (!lightPatternMatch) throw new Error(`Invalid machine line: ${line}`)
  const requiredLightPattern = lightPatternMatch[1]

  // Initial indicator lights (all off)
  const currentLightPattern = '.'.repeat(requiredLightPattern.length)

  // Button wiring
  const buttonWiringMatch = line.match(/\(([\d,]+)\)/g)
  if (!buttonWiringMatch || buttonWiringMatch.length < 1)
    throw new Error(`Invalid machine line (buttons): ${line}`)
  const buttonGroups = buttonWiringMatch.map((match) =>
    match.slice(1, -1).split(',').map(Number)
  )

  // Joltage
  const joltageMatch = line.match(/\{([\d,]+)\}/)
  if (!joltageMatch) throw new Error(`Invalid machine line (joltage): ${line}`)
  const joltage = joltageMatch[1].split(',').map((numStr) => Number(numStr))

  return {
    requiredLightPattern,
    currentLightPattern,
    buttonGroups,
    joltage,
  }
}

function pressLightsButton(
  buttonGroup: ButtonGroup,
  currentPattern: string
): string {
  // Toggle the lights at the indices specified in the button group
  let newPattern = currentPattern.split('')
  buttonGroup.forEach((index) => {
    if (newPattern[index] === '#') {
      newPattern[index] = '.'
    } else {
      newPattern[index] = '#'
    }
  })
  return newPattern.join('')
}

function findFewestButtonPresses(machine: Machine): number {
  const { requiredLightPattern, buttonGroups } = machine

  interface State {
    pattern: string
    presses: number
  }

  const queue: State[] = [{ pattern: machine.currentLightPattern, presses: 0 }]
  const visited = new Set<string>()
  visited.add(machine.currentLightPattern)

  while (queue.length > 0) {
    const currentState = queue.shift()!
    const { pattern, presses } = currentState

    if (pattern === requiredLightPattern) {
      // log(`Machine configured to ${requiredLightPattern} in ${presses} presses`)
      return presses
    }

    // Try pressing each button group
    for (const buttonGroup of buttonGroups) {
      const newPattern = pressLightsButton(buttonGroup, pattern)
      if (!visited.has(newPattern)) {
        visited.add(newPattern)
        queue.push({ pattern: newPattern, presses: presses + 1 })
      }
    }
  }

  log(`Unable to configure machine to ${requiredLightPattern}`)
  return -1 // Not possible
}

export function answer(): number {
  lines = getLines(data)
  let total = 0

  try {
    // Work out the fewest button presses required to correctly configure the indicator lights on all of the machines
    lines.forEach((line) => {
      const machine = parseMachine(line)
      const fewestPresses = findFewestButtonPresses(machine)
      total += fewestPresses
    })
  } catch (e: any) {
    log(`Error: ${e.message}`)
    log(`Stack Trace:\n${e.stack}`)
  }

  return total
}

answer()

export const confirmedAnswer = 500
