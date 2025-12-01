import { useLocation } from '@solidjs/router'
import Link from './Link'

const linkColor = 'text-white'

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
          <Link href='/' color={linkColor}>
            Home
          </Link>
        </li>
        <li class={`border-b-2 ${active('/puzzle')} mx-1.5 sm:mx-6`}>
          <Link href='/puzzle' color={linkColor}>
            Puzzle List
          </Link>
        </li>
        <li class={`border-b-2 ${active('/puzzle/2023')} mx-1.5 sm:mx-6`}>
          <Link href='/puzzle/2023' color={linkColor}>
            2023
          </Link>
        </li>
        <li class={`border-b-2 ${active('/puzzle/2024')} mx-1.5 sm:mx-6`}>
          <Link href='/puzzle/2024' color={linkColor}>
            2024
          </Link>
        </li>
        <li class={`border-b-2 ${active('/puzzle/2025')} mx-1.5 sm:mx-6`}>
          <Link href='/puzzle/2025' color={linkColor}>
            2025
          </Link>
        </li>
      </ul>
    </nav>
  )
}
