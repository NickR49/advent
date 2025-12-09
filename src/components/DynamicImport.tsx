import { useParams } from '@solidjs/router'
import { codeToHtml } from 'shiki'
import { createEffect, createSignal, Show } from 'solid-js'
import { Coord3D, Edge } from '~/utils/3dUtils'
import { Grid } from '~/utils/gridUtils'
import { log } from '~/utils/log'
import CodeBlock from './CodeBlock'
import FlexboxGrid from './FlexboxGrid'
import Graph3D from './Graph3D'
import Result from './Result'

const puzzles = import.meta.glob('../puzzles/*/*/puzzle*.ts')

const DynamicImportComponent = () => {
  const params = useParams()

  const [answer, setAnswer] = createSignal<number>()
  const [confirmedAnswer, setConfirmedAnswer] = createSignal<number>()
  const [codeHtml, setCodeHtml] = createSignal<string>()
  const [grid, setGrid] = createSignal<Grid>()
  const [nodes, setNodes] = createSignal<Coord3D[]>()
  const [edges, setEdges] = createSignal<Edge[]>()
  const [tab, setTab] = createSignal<'code' | 'visualisation'>('code')
  const [showSurfaces, setShowSurfaces] = createSignal(false)
  const [fitToWidth, setFitToWidth] = createSignal(false)
  const puzzle = () => (params.day?.slice(2, 3) === 'b' ? 2 : 1)

  const hasVisualisation = () => {
    return grid() || (nodes() && edges())
  }

  createEffect(async () => {
    const year = params.year
    const day = params.day?.slice(0, 2)

    if (year && day && puzzle) {
      const modulePath = `../puzzles/${year}/${day}/puzzle${puzzle()}.ts`

      try {
        const loadModule = puzzles[modulePath]
        if (loadModule) {
          const module: any = await loadModule()
          if (module && typeof module.answer === 'function') {
            if (module.default) {
              const html = await codeToHtml(module.default, {
                lang: 'typescript',
                theme: 'dark-plus',
              })
              setCodeHtml(html)
            }
            const startTime = new Date().getTime()
            const answer = module.answer()
            const endTime = new Date().getTime()
            log(
              `${year} - Day ${Number(day)} Puzzle ${puzzle()}: ${
                endTime - startTime
              }ms`,
            )
            setAnswer(answer)
            const confirmedAnswer = module.confirmedAnswer
            setConfirmedAnswer(confirmedAnswer)
            const grid = module.grid
            setGrid(grid)
            const nodes = module.nodes
            setNodes(nodes)
            const edges = module.edges
            setEdges(edges)
          } else {
            // console.error('The module does not export an answer function.')
          }
        } else {
          console.error(`Module not found in glob: ${modulePath}`)
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
      <div class='flex space-between w-full px-6'>
        <div class='flex w-full gap-4'>
          <button
            onClick={() => setTab('code')}
            class={tab() === 'code' ? 'font-bold text-blue-500' : ''}
          >
            Code
          </button>
          {hasVisualisation() && (
            <button
              onClick={() => setTab('visualisation')}
              class={tab() === 'visualisation' ? 'font-bold text-blue-500' : ''}
            >
              Visualisation
            </button>
          )}
        </div>
        <Result result={answer()} confirmedResult={confirmedAnswer()} />
      </div>
      {codeHtml() && tab() === 'code' && <CodeBlock code={codeHtml()} />}
      <Show when={grid() && tab() === 'visualisation'}>
        <div class='w-full px-6'>
          <div class='flex gap-4 mb-2'>
            <label class='flex items-center gap-2 cursor-pointer'>
              <input
                type='checkbox'
                checked={fitToWidth()}
                onChange={(e) => setFitToWidth(e.currentTarget.checked)}
                class='w-4 h-4'
              />
              <span class='text-sm'>Fit to width</span>
            </label>
          </div>
        </div>
        <div class={fitToWidth() ? 'w-full px-6' : 'w-dvw overflow-x-scroll'}>
          <FlexboxGrid grid={grid()!} fitToWidth={fitToWidth()} />
        </div>
      </Show>
      <Show when={nodes() && edges() && tab() === 'visualisation'}>
        <div class='w-full px-6'>
          <div class='flex gap-4 mb-2'>
            <label class='flex items-center gap-2 cursor-pointer'>
              <input
                type='checkbox'
                checked={showSurfaces()}
                onChange={(e) => setShowSurfaces(e.currentTarget.checked)}
                class='w-4 h-4'
              />
              <span class='text-sm'>Show surfaces</span>
            </label>
          </div>
          <Graph3D
            nodes={nodes()!}
            edges={edges()!}
            showSurfaces={showSurfaces()}
          />
        </div>
      </Show>
    </div>
  )
}

export default DynamicImportComponent
