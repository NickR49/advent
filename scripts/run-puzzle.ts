// Usage: To run puzzle `src/puzzles/2025/10/puzzle2.ts` use `bun scripts/run-puzzle 2025-10b`
import { statSync } from 'fs'
import { join } from 'path'
import { cwd } from 'process'

async function runPuzzle(puzzlePath: string) {
  console.log(`Running puzzle: ${puzzlePath}`)
  try {
    const puzzleModule = await import(puzzlePath)
    if (typeof puzzleModule.answer === 'function') {
      const result = puzzleModule.answer()
      console.log(`Answer: ${result}`)
    } else {
      console.log(`No answer function found in ${puzzlePath}`)
    }
  } catch (error) {
    console.error(`Error running puzzle ${puzzlePath}:`, error)
  }
}

async function main() {
  const args = process.argv.slice(2)
  if (args.length !== 1) {
    console.error('Usage: bun run-puzzle 2025-10b')
    process.exit(1)
  }

  const puzzleArg = args[0]
  const [year, dayWithPart] = puzzleArg.split('-')
  const day = dayWithPart.slice(0, -1)
  const part = dayWithPart.slice(-1).toLowerCase()

  if (!['a', 'b'].includes(part)) {
    console.error('Part must be "a" or "b"')
    process.exit(1)
  }
  const puzzleFile = `puzzle${part === 'a' ? '1' : '2'}.ts`
  const puzzlePath = join(cwd(), 'src', 'puzzles', year, day, puzzleFile)

  if (!statSync(puzzlePath).isFile()) {
    console.error(`Puzzle file not found: ${puzzlePath}`)
    process.exit(1)
  }

  await runPuzzle(puzzlePath)
}

main()
