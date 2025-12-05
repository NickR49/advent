import { readdir, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { cwd } from 'node:process'

const PUZZLES_DIR = join(cwd(), 'src/puzzles')
const IGNORE_FILE = join(cwd(), 'puzzles-ignore.json')
const TIMEOUT_MS = 30000 // 30 seconds threshold for "slow" puzzles

interface PuzzleResult {
  file: string
  status: 'pass' | 'fail' | 'skipped' | 'timeout' | 'error' | 'no-answer'
  duration: number
  result?: any
  expected?: any
  error?: any
}

async function getIgnoreList(): Promise<Set<string>> {
  try {
    const file = Bun.file(IGNORE_FILE)
    if (await file.exists()) {
      const json = await file.json()
      return new Set(json)
    }
  } catch (e) {
    console.warn('Could not read puzzles-ignore.json', e)
  }
  return new Set()
}

async function saveIgnoreList(list: Set<string>) {
  try {
    const sorted = Array.from(list).sort()
    await writeFile(IGNORE_FILE, JSON.stringify(sorted, null, 2))
    console.log(`Updated ${IGNORE_FILE} with new ignored puzzles.`)
  } catch (e) {
    console.error('Failed to update puzzles-ignore.json', e)
  }
}

async function findPuzzles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'xx') continue
      files.push(...(await findPuzzles(path)))
    } else if (entry.name.match(/^puzzle\d+\.ts$/)) {
      files.push(path)
    }
  }
  return files
}

async function runPuzzles() {
  const ignoreList = await getIgnoreList()
  const allPuzzles = await findPuzzles(PUZZLES_DIR)
  const results: PuzzleResult[] = []
  const newIgnores = new Set<string>()

  // Sort for consistent order
  allPuzzles.sort()

  console.log(`Found ${allPuzzles.length} puzzles.`)
  console.log('Running puzzles...\n')

  // Header
  console.log(
    `${'Puzzle'.padEnd(40)} | ${'Status'.padEnd(10)} | ${'Time (ms)'.padEnd(
      10,
    )} | ${'Result'.padEnd(20)} | ${'Expected'.padEnd(20)}`,
  )
  console.log('-'.repeat(110))

  let failed = false

  for (const puzzlePath of allPuzzles) {
    const relPath = relative(PUZZLES_DIR, puzzlePath)

    if (ignoreList.has(relPath)) {
      console.log(
        `${relPath.padEnd(40)} | ${'SKIPPED'.padEnd(10)} | ${'-'.padEnd(
          10,
        )} | ${'-'.padEnd(20)} | ${'-'.padEnd(20)}`,
      )
      results.push({ file: relPath, status: 'skipped', duration: 0 })
      continue
    }

    const start = performance.now()

    // Capture console output
    const originalLog = console.log
    const originalError = console.error
    const logs: string[] = []

    console.log = (...args) => logs.push(args.map((a) => String(a)).join(' '))
    console.error = (...args) => logs.push(args.map((a) => String(a)).join(' '))

    try {
      // Dynamic import
      const module = await import(puzzlePath)

      if (!('confirmedAnswer' in module)) {
        const duration = performance.now() - start
        // Restore console
        console.log = originalLog
        console.error = originalError

        console.log(
          `${relPath.padEnd(40)} | ${'NO ANSWER'.padEnd(10)} | ${duration
            .toFixed(2)
            .padEnd(10)} | ${'-'.padEnd(20)} | ${'-'.padEnd(20)}`,
        )
        results.push({ file: relPath, status: 'no-answer', duration })
        continue
      }

      const expected = module.confirmedAnswer

      let result
      if (typeof module.answer === 'function') {
        result = module.answer()
      } else {
        throw new Error('answer is not a function')
      }

      const duration = performance.now() - start
      const match = String(result) === String(expected)
      let status = match ? 'PASS' : 'FAIL'

      if (!match) failed = true

      // Check for timeout
      if (duration > TIMEOUT_MS) {
        status = match ? 'SLOW' : 'FAIL(SLOW)'
        if (!process.env.CI) {
          newIgnores.add(relPath)
        }
      }

      // Restore console
      console.log = originalLog
      console.error = originalError

      console.log(
        `${relPath.padEnd(40)} | ${status.padEnd(10)} | ${duration
          .toFixed(2)
          .padEnd(10)} | ${String(result).slice(0, 19).padEnd(20)} | ${String(
          expected,
        )
          .slice(0, 19)
          .padEnd(20)}`,
      )

      if (!match) {
        console.log('  Output:')
        logs.forEach((l) => console.log('    ' + l))
      }

      results.push({
        file: relPath,
        status: match ? 'pass' : 'fail',
        duration,
        result,
        expected,
      })
    } catch (e: any) {
      const duration = performance.now() - start

      // Restore console
      console.log = originalLog
      console.error = originalError

      console.log(
        `${relPath.padEnd(40)} | ${'ERROR'.padEnd(10)} | ${duration
          .toFixed(2)
          .padEnd(10)} | ${e.message.slice(0, 19).padEnd(20)} | ${'-'.padEnd(
          20,
        )}`,
      )
      console.log('  Output:')
      logs.forEach((l) => console.log('    ' + l))

      results.push({ file: relPath, status: 'error', duration, error: e })
      failed = true
    } finally {
      // Ensure console is restored in case of weird errors
      if (console.log !== originalLog) console.log = originalLog
      if (console.error !== originalError) console.error = originalError
    }
  }

  console.log('-'.repeat(110))

  if (newIgnores.size > 0) {
    console.log(`Adding ${newIgnores.size} slow puzzles to ignore list...`)
    const currentIgnores = await getIgnoreList()
    newIgnores.forEach((p) => currentIgnores.add(p))
    await saveIgnoreList(currentIgnores)
  }

  if (failed) {
    console.error('Some puzzles failed.')
    process.exit(1)
  } else {
    console.log('All checks passed.')
    process.exit(0)
  }
}

runPuzzles()
