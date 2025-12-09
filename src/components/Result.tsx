import { createSignal } from 'solid-js'

interface Props {
  result?: number
  confirmedResult?: number
}

export default function Result(props: Props) {
  const nonMatch = () =>
    !!props.confirmedResult && props.result !== props.confirmedResult

  const [clicked, setClicked] = createSignal(false)

  function handleClick() {
    navigator.clipboard.writeText(props.result?.toString() ?? '')
    console.log(`Copied ${props.result} to clipboard`)
    setClicked(true)
    setTimeout(() => setClicked(false), 500)
  }

  return (
    <button
      onClick={handleClick}
      class={`rounded-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 active:border-gray-400 px-4 py-2 transition duration-700 ${
        clicked() ? 'text-shadow-lg text-shadow-blue-500' : ''
      }`}
    >
      <span class={nonMatch() ? 'text-red-700 font-semibold' : 'text-gray-800'}>
        {props.result ?? '-'}
      </span>
    </button>
  )
}
