import { Grid } from '~/utils/gridUtils'
import './CodeBlock.css'

interface Props {
  grid: Grid
}

export default function DisplayGrid(props: Props) {
  const maxDimension = Math.max(props.grid.width, props.grid.height)
  const fontSize = Math.max(8, 32 - maxDimension)

  // Flexbox
  // return (
  // <div class='flex flex-col border border-gray-400'>
  //   {props.grid.cells.map((row) => (
  //     <div class='flex flex-row'>
  //       {row.map((cell) => (
  //         <div class='flex w-7 h-7 justify-center items-center border border-gray-400'>
  //           {cell}
  //         </div>
  //       ))}
  //     </div>
  //   ))}
  // </div>
  // )

  // CSS Grid
  return (
    <div
      class='grid w-full max-w-full border border-gray-400 overflow-auto m-2'
      style={{
        'grid-template-columns': `repeat(${props.grid.width}, minmax(0, 1fr))`,
        'font-size': `${fontSize}px`,
      }}
    >
      {props.grid.cells.flat().map((cell) => (
        <div class='flex items-center justify-center border border-gray-400 aspect-square'>
          {cell}
        </div>
      ))}
    </div>
  )
}
