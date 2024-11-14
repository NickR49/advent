import { useParams, useSearchParams } from '@solidjs/router'
import { createEffect, createSignal } from 'solid-js'
import Result from './Result'

const DynamicImportComponent = () => {
  const params = useParams()
  const [answer, setAnswer] = createSignal<string>()

  createEffect(async () => {
    const year = params.year
    const day = params.day

    if (year && day) {
      const modulePath = `../puzzles/${year}-${day}.ts`

      try {
        const module = await import(modulePath)
        // Handle the imported module (e.g., set state or call functions from the module)
        // console.log("Module loaded:", module);
        if (module && typeof module.answer === 'function') {
          // Call the 'answer' function
          const result = module.answer()
          //   console.log(`>>>>> The final result is ${result}!!!`);
          setAnswer(result)
        } else {
          console.error('The module does not export an answer function.')
        }
      } catch (error) {
        console.error('Error loading module:', error)
      }
    } else {
      console.error('Year or puzzle query parameter is missing.')
    }
  })

  return (
    <div>
      <Result result={answer()} />
    </div>
  )
}

export default DynamicImportComponent
