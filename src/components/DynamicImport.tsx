import { useParams } from '@solidjs/router'
import { codeToHtml } from 'shiki'
import { createEffect, createSignal, Show } from 'solid-js'
import { Grid } from '~/utils/gridUtils'
import CodeBlock from './CodeBlock'
import FlexboxGrid from './FlexboxGrid'
import Result from './Result'

const DynamicImportComponent = () => {
  const params = useParams()

  const [answer, setAnswer] = createSignal<number>()
  const [confirmedAnswer, setConfirmedAnswer] = createSignal<number>()
  const [codeHtml, setCodeHtml] = createSignal<string>()
  const [grid, setGrid] = createSignal<Grid>()
  const puzzle = () => (params.day?.slice(2, 3) === 'b' ? 2 : 1)

  createEffect(async () => {
    const year = params.year
    const day = params.day?.slice(0, 2)

    if (year && day && puzzle) {
      const modulePath = `../puzzles/${year}/${day}/puzzle${puzzle()}.ts`

      try {
        const module = await import(modulePath)
        if (module && typeof module.answer === 'function') {
          if (module.default) {
            const html = await codeToHtml(module.default, {
              lang: 'typescript',
              theme: 'dark-plus',
            })
            setCodeHtml(html)
          }
          const answer = module.answer()
          setAnswer(answer)
          const confirmedAnswer = module.confirmedAnswer
          setConfirmedAnswer(confirmedAnswer)
          const grid = module.grid
          setGrid(grid)
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
      <Result result={answer()} confirmedResult={confirmedAnswer()} />
      {codeHtml() && <CodeBlock code={codeHtml()} />}
      <Show when={grid()}>
        <div class='w-dvw overflow-x-scroll'>
          <FlexboxGrid grid={grid()!} />
        </div>
      </Show>
    </div>
  )
}

export default DynamicImportComponent
