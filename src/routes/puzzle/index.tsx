import { A } from '@solidjs/router'

export default function PuzzleList() {
  return (
    <div class='flex flex-col gap-1 p-6'>
      <A href='/puzzle/2023/01' class='text-sky-600 hover:underline'>
        2023-01
      </A>
      <A href='/puzzle/2023/02' class='text-sky-600 hover:underline'>
        2023-02
      </A>
    </div>
  )
}
