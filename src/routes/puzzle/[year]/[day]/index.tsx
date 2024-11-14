import { useParams } from '@solidjs/router'
import DynamicImportComponent from '~/components/DynamicImport'

export default function Puzzle() {
  const params = useParams()
  return (
    <main class='flex flex-col text-center mx-auto text-gray-700 p-4 gap-8'>
      <h1 class='max-6-xs text-3xl text-sky-700 font-thin'>
        Results for {params.year}-{params.day}
      </h1>
      <DynamicImportComponent puzzle={1} />
      <DynamicImportComponent puzzle={2} />
    </main>
  )
}
