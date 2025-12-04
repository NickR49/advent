import { Title } from '@solidjs/meta'
import Link from '~/components/Link'

export default function PuzzleList() {
  // Identify all the folder names in the src/puzzles directory
  const modules = import.meta.glob('../../puzzles/**/*.ts', {
    import: 'answer',
  })

  const puzzleSet = new Set<string>()
  Object.keys(modules).forEach((module) => {
    const timestamp = module.match(/(\d{4})\/(\d{2})/)?.[0]
    if (timestamp?.length === 7) {
      puzzleSet.add(timestamp)
    }
  })

  return (
    <div>
      <Title>Puzzle List</Title>
      <div class='flex flex-col gap-1 p-6'>
        {[...puzzleSet].map((puzzle) => (
          <Link href={`/puzzle/${puzzle.replace('-', '/')}`}>{puzzle}</Link>
        ))}
      </div>
    </div>
  )
}
