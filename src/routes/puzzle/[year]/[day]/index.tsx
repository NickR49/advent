import { useParams } from '@solidjs/router'
import DynamicImportComponent from '~/components/DynamicImport'
import Link from '~/components/Link'

export default function Puzzle() {
  const params = useParams()
  const day = params.day?.slice(0, 2)
  const puzzle = () => (params.day?.slice(2, 3) === 'b' ? 2 : 1)

  return (
    <main class='flex flex-col text-center mx-auto text-gray-700 py-4 gap-8'>
      <span class='flex gap-4 justify-center items-baseline'>
        <h1 class='max-6-xs text-3xl text-sky-700 font-thin'>
          {params.year}-{day}
        </h1>
        <Link href={`./${day}a`} selected={puzzle() === 1}>
          Puzzle 1
        </Link>
        <Link href={`./${day}b`} selected={puzzle() === 2}>
          Puzzle 2
        </Link>
      </span>
      <DynamicImportComponent />
    </main>
  )
}
