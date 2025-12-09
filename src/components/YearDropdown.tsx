import { For, Show } from 'solid-js'
import Link from './Link'

const linkColor = 'text-white'

interface Props {
  year: string
  days: string[]
  isOpen: boolean
  isActive: boolean
  onToggle: (e: MouseEvent) => void
  onClose: () => void
}

export default function YearDropdown(props: Props) {
  return (
    <li
      class={`relative border-b-2 ${
        props.isActive
          ? 'border-sky-600'
          : 'border-transparent hover:border-sky-600'
      } mx-1.5 sm:mx-6`}
    >
      <button
        class='text-white hover:brightness-150 cursor-pointer'
        onClick={props.onToggle}
      >
        {props.year}
      </button>
      <Show when={props.isOpen}>
        <ul class='absolute top-full mt-2 bg-sky-700 rounded shadow-lg py-2 min-w-[120px] z-50 max-h-[400px] overflow-y-auto left-0'>
          <li class='px-4 py-1 hover:bg-sky-600'>
            <Link
              href={`/puzzle/${props.year}`}
              color={linkColor}
              onClick={props.onClose}
            >
              All {props.year}
            </Link>
          </li>
          <li class='border-t border-sky-600 my-1'></li>
          <For each={props.days}>
            {(day) => (
              <li class='px-4 py-1 hover:bg-sky-600'>
                <Link
                  href={`/puzzle/${props.year}/${day}`}
                  color={linkColor}
                  onClick={props.onClose}
                >
                  Day {day}
                </Link>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </li>
  )
}
