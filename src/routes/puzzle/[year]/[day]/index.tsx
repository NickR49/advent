import DynamicImportComponent from '~/components/DynamicImport'

export default function Puzzle() {
  return (
    <main class="flex flex-col text-center mx-auto text-gray-700 p-4 gap-8">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase ">
        Puzzle
      </h1>
      <DynamicImportComponent puzzle={1} />
      <DynamicImportComponent puzzle={2} />
    </main>
  )
}
