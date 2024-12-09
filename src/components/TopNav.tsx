import { useLocation } from '@solidjs/router'

export default function TopNav() {
  const location = useLocation()
  const active = (path: string) =>
    path == location.pathname
      ? 'border-sky-600'
      : 'border-transparent hover:border-sky-600'
  return (
    <nav class='bg-sky-800'>
      <ul class='container flex items-center p-3 text-gray-200'>
        <li class={`border-b-2 ${active('/')} mx-1.5 sm:mx-6`}>
          <a href='/'>Home</a>
        </li>
        <li class={`border-b-2 ${active('/puzzle')} mx-1.5 sm:mx-6`}>
          <a href='/puzzle'>Puzzle List</a>
        </li>
        <li class={`border-b-2 ${active('/puzzle/2023')} mx-1.5 sm:mx-6`}>
          <a href='/puzzle/2023'>2023</a>
        </li>
        <li class={`border-b-2 ${active('/puzzle/2024')} mx-1.5 sm:mx-6`}>
          <a href='/puzzle/2024'>2024</a>
        </li>
      </ul>
    </nav>
  )
}
