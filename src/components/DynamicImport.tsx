import { useParams } from '@solidjs/router'
import { codeToHtml } from 'shiki'
import { createEffect, createSignal } from 'solid-js'
import CodeBlock from './CodeBlock'
import Result from './Result'

interface Props {
  puzzle: 1 | 2
}

const DynamicImportComponent = (props: Props) => {
  const params = useParams()
  const [answer, setAnswer] = createSignal<number>()
  const [confirmedAnswer, setConfirmedAnswer] = createSignal<number>()
  const [codeHtml, setCodeHtml] = createSignal<string>()

  createEffect(async () => {
    const year = params.year
    const day = params.day

    if (year && day) {
      const modulePath = `../puzzles/${year}/${day}/puzzle${props.puzzle}.ts`

      try {
        const module = await import(modulePath)
        if (module && typeof module.answer === 'function') {
          if (module.moduleText) {
            const html = await codeToHtml(module.moduleText, {
              lang: 'typescript',
              theme: 'dark-plus',
            })
            setCodeHtml(html)
          }
          const answer = module.answer()
          setAnswer(answer)
          const confirmedAnswer = module.confirmedAnswer
          setConfirmedAnswer(confirmedAnswer)
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
    <div class='flex flex-col gap-2 items-center'>
      <h2>Puzzle {props.puzzle}</h2>
      <Result result={answer()} confirmedResult={confirmedAnswer()} />
      {codeHtml() && <CodeBlock code={codeHtml()} />}
    </div>
  )
}

export default DynamicImportComponent
