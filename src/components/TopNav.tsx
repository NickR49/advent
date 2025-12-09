import { useLocation } from '@solidjs/router'
import { createSignal, For, onCleanup, onMount } from 'solid-js'
import Link from './Link'
import YearDropdown from './YearDropdown'

const linkColor = 'text-white'

// Build puzzle map from available puzzle files
const modules = import.meta.glob('../puzzles/**/*.ts', { import: 'answer' })
const puzzlesByYear = new Map<string, string[]>()

Object.keys(modules).forEach((module) => {
  const match = module.match(/(\d{4})\/(\d{2})/)
  if (match) {
    const [, year, day] = match
    if (!puzzlesByYear.has(year)) {
      puzzlesByYear.set(year, [])
    }
    const days = puzzlesByYear.get(year)!
    if (!days.includes(day)) {
      days.push(day)
    }
  }
})

// Sort days for each year
puzzlesByYear.forEach((days) => days.sort())

const years = ['2023', '2024', '2025']

export default function TopNav() {
  const location = useLocation()
  const [openYear, setOpenYear] = createSignal<string | null>(null)
  const refs = { nav: undefined as HTMLElement | undefined }

  const active = (path: string) =>
    path == location.pathname
      ? 'border-sky-600'
      : 'border-transparent hover:border-sky-600'

  const toggleDropdown = (year: string, e: MouseEvent) => {
    e.stopPropagation()
    setOpenYear(openYear() === year ? null : year)
  }

  // Close dropdown when clicking outside
  onMount(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (refs.nav && !refs.nav.contains(e.target as Node)) {
        setOpenYear(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    onCleanup(() => document.removeEventListener('click', handleClickOutside))
  })

  return (
    <nav class='bg-sky-800' ref={(el) => (refs.nav = el)}>
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
        <For each={years}>
          {(year) => (
            <YearDropdown
              year={year}
              days={puzzlesByYear.get(year) || []}
              isOpen={openYear() === year}
              isActive={location.pathname.startsWith(`/puzzle/${year}`)}
              onToggle={(e) => toggleDropdown(year, e)}
              onClose={() => setOpenYear(null)}
            />
          )}
        </For>
      </ul>
    </nav>
  )
}
