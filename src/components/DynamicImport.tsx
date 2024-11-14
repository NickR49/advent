import { useParams } from '@solidjs/router'
import { createEffect, createSignal } from 'solid-js'
import Result from './Result'

interface Props {
  puzzle: 1 | 2
}

const DynamicImportComponent = (props: Props) => {
  const params = useParams()
  const [answer, setAnswer] = createSignal<string>()

  createEffect(async () => {
    const year = params.year
    const day = params.day

    if (year && day) {
      const modulePath = `../puzzles/${year}-${day}/puzzle${props.puzzle}.ts`

      try {
        const module = await import(modulePath)
        if (module && typeof module.answer === 'function') {
          const result = module.answer()
          setAnswer(result)
        } else {
          // console.error('The module does not export an answer function.')
        }
      } catch (error) {
        // console.error('Error loading module:', error)
      }
    } else {
      console.error('Year or puzzle parameter is missing.')
    }
  })

  return (
    <div>
      <h2>Puzzle {props.puzzle}</h2>
      <Result result={answer()} />
    </div>
  )
}

export default DynamicImportComponent
