import { cn } from '~/utils/cn'
import { Grid, isMarked } from '~/utils/gridUtils'
import './CodeBlock.css'

interface Props {
  grid: Grid
  fitToWidth?: boolean
}

export default function FlexboxGrid(props: Props) {
  const cellStyle = () =>
    props.fitToWidth
      ? { flex: '1 1 0', 'min-width': '0' }
      : { width: '1.75rem', height: '1.75rem', 'flex-shrink': '0' }

  return (
    <div
      class='flex flex-col'
      style={{ width: props.fitToWidth ? '100%' : 'fit-content' }}
    >
      <div class='flex flex-row'>
        <div
          class='flex items-center justify-center text-xs overflow-hidden'
          style={cellStyle()}
        ></div>
        {props.grid.cells[0].map((_, xIndex) => (
          <div
            class='flex items-center justify-center text-xs overflow-hidden'
            style={cellStyle()}
          >
            {xIndex}
          </div>
        ))}
      </div>
      {props.grid.cells.map((row, yIndex) => (
        <div class='flex flex-row'>
          <div
            class='flex items-center justify-center text-xs overflow-hidden'
            style={cellStyle()}
          >
            {yIndex}
          </div>
          {row.map((cell, xIndex) => (
            <div
              class={cn(
                'flex justify-center items-center border border-gray-400 aspect-square text-xs overflow-hidden',
                cell === '#' && 'bg-gray-600',
                cell === '.' && 'bg-gray-300',
                cell === '0' && 'bg-white',
                cell === '1' && 'bg-green-500',
                isMarked(props.grid, [xIndex, yIndex]) &&
                  'border-2 border-red-500',
              )}
              style={cellStyle()}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
