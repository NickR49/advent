import { cn } from '~/utils/cn'
import { Grid, isMarked } from '~/utils/gridUtils'
import { log } from '~/utils/log'
import './CodeBlock.css'

interface Props {
  grid: Grid
}

export default function FlexboxGrid(props: Props) {
  return (
    <div class='flex flex-col w-fit'>
      <div class='flex flex-row'>
        <div class='h-7 w-7'></div>
        {props.grid.cells[0].map((_, xIndex) => (
          <div class='w-7'>{xIndex}</div>
        ))}
      </div>
      {props.grid.cells.map((row, yIndex) => (
        <div class='flex flex-row'>
          <div class='w-7'>{yIndex}</div>
          {row.map((cell, xIndex) => (
            <div
              class={cn(
                'flex w-7 h-7 justify-center items-center border border-gray-400',
                cell === '#' && 'bg-gray-600',
                cell === '.' && 'bg-gray-300',
                cell === '0' && 'bg-white',
                cell === '1' && 'bg-green-500',
                isMarked(props.grid, [xIndex, yIndex]) &&
                  'border-2 border-red-500',
              )}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
