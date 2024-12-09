interface Props {
  result?: number
  confirmedResult?: number
}

export default function Result(props: Props) {
  const nonMatch = () =>
    !!props.confirmedResult && props.result !== props.confirmedResult

  return (
    <button
      onClick={() =>
        navigator.clipboard.writeText(props.result?.toString() ?? '')
      }
      class='w-[200px] rounded-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 active:border-gray-400 px-[2rem] py-[1rem]'
    >
      <span class={nonMatch() ? 'text-red-700 font-semibold' : 'text-gray-800'}>
        {props.result ?? '-'}
      </span>
    </button>
  )
}
