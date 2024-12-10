import { Grid } from '~/utils/gridUtils'
import './CodeBlock.css'

interface Props {
  grid: Grid
}

export default function CssGrid(props: Props) {
  // const fontSize = () => window.innerWidth / props.grid.width / 2
  const fontSize = () => 13

  return (
    <div
      class='grid w-auto max-w-full border-t border-l border-gray-500 overflow-auto m-2'
      style={{
        'grid-template-columns': `repeat(${props.grid.width}, minmax(0, 30px))`,
        'grid-auto-rows': `30px`,
        'font-size': `${fontSize()}px`,
      }}
    >
      {props.grid.cells.flat().map((cell) => (
        <div class='flex items-center justify-center border-r border-b border-gray-500'>
          {cell}
        </div>
      ))}
    </div>
  )
}
