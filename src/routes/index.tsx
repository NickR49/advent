import Counter from '~/components/Counter'
import Link from '~/components/Link'

export default function Home() {
  return (
    <main class='text-center mx-auto text-gray-700 p-4'>
      <h1 class='max-6-xs text-6xl text-sky-700 font-thin uppercase my-16'>
        Hello world!
      </h1>
      <Counter />
      <p class='mt-8'>
        Visit{' '}
        <Link href='https://solidjs.com' newTab>
          solidjs.com
        </Link>{' '}
        to learn how to build Solid apps.
      </p>
      <p class='my-4'>
        <span>Home</span>
        {' - '}
        <Link href='/puzzle'>Puzzle List</Link>{' '}
      </p>
    </main>
  )
}
