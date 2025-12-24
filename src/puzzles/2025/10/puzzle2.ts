import { isEqual } from 'lodash'

import { getLines } from '~/utils/lineUtils'
import { log } from '~/utils/log'

import data from './input.txt?raw'
export { default } from './puzzle2.ts?raw'

let lines: string[]

type ButtonGroup = number[]

interface Machine {
  requiredLightPattern: string // '.' - off, '#' - on
  currentLightPattern: string
  buttonGroups: ButtonGroup[]
  requiredJoltage: number[]
  currentJoltage: number[]
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

  // Required joltage
  const joltageMatch = line.match(/\{([\d,]+)\}/)
  if (!joltageMatch) throw new Error(`Invalid machine line (joltage): ${line}`)
  const requiredJoltage = joltageMatch[1]
    .split(',')
    .map((numStr) => Number(numStr))

  const currentJoltage = requiredJoltage.map(() => 0)

  return {
    requiredLightPattern,
    currentLightPattern,
    buttonGroups,
    requiredJoltage,
    currentJoltage,
  }
}

function pressJoltageButton(
  buttonGroup: ButtonGroup,
  currentJoltage: number[]
): number[] {
  // Increment the joltage at the indices specified in the button group
  let newJoltage = [...currentJoltage]
  buttonGroup.forEach((index) => {
    newJoltage[index]++
  })
  return newJoltage
}

function findFewestButtonPresses(machine: Machine): number {
  const { requiredJoltage, buttonGroups, currentJoltage } = machine

  interface State {
    joltage: number[]
    presses: number
  }
  const initialState: State = { joltage: currentJoltage, presses: 0 }

  const queue: State[] = [initialState]
  const visited = new Set<string>()
  visited.add(initialState.joltage.toString())
  while (queue.length > 0) {
    const currentState = queue.shift()!
    const { joltage, presses } = currentState

    if (isEqual(joltage, requiredJoltage)) {
      log(`Machine configured to ${requiredJoltage} in ${presses} presses`)
      return presses
    }

    for (const buttonGroup of buttonGroups) {
      const newJoltage = pressJoltageButton(buttonGroup, joltage)
      const newJoltageKey = newJoltage.toString()
      if (!visited.has(newJoltageKey)) {
        visited.add(newJoltageKey)
        queue.push({ joltage: newJoltage, presses: presses + 1 })
      }
    }
  }

  log(`Unable to configure machine to ${requiredJoltage}`)
  return -1 // Not possible
}

export function answer(): number {
  lines = getLines(data)
  let total = 0

  try {
    // Work out the fewest button presses required to correctly configure the joltage counters on all of the machines
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

// export const confirmedAnswer =
