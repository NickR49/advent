import { Grid } from '~/utils/gridUtils'
import { log } from '~/utils/log'
import './CodeBlock.css'

interface Props {
  grid: Grid
}

export default function FlexboxGrid(props: Props) {
  return (
    <div class='flex flex-col border border-gray-400'>
      {props.grid.cells.map((row) => (
        <div class='flex flex-row'>
          {row.map((cell) => (
            <div class='flex w-7 h-7 justify-center items-center border border-gray-400'>
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
