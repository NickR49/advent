import { A, useParams } from '@solidjs/router'

export default function PuzzleList() {
  const params = useParams()

  // Identify all the folder names in the src/puzzles directory
  const modules = import.meta.glob('../../../puzzles/**/*.ts', {
    import: 'answer',
  })

  const puzzleSet = new Set<string>()
  Object.keys(modules).forEach((module) => {
    const timestamp = module.match(/(\d{4})-(\d{2})/)?.[0]
    if (timestamp?.length === 7) {
      puzzleSet.add(timestamp)
    }
  })

  return (
    <div class='flex flex-col gap-1 p-6'>
      {[...puzzleSet]
        .filter((puzzle) => puzzle.slice(0, 4) === params.year)
        .map((puzzle) => (
          <A
            href={`/puzzle/${puzzle.replace('-', '/')}`}
            class='text-sky-600 hover:underline'
          >
            {puzzle}
          </A>
        ))}
    </div>
  )
}
