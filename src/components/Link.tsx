import { A } from '@solidjs/router'
import { cn } from '~/utils/cn'

interface Props {
  href: string
  color?: 'text-blue-500' | 'text-green-500' | 'text-white'
  selected?: boolean
  newTab?: boolean
  children?: any
  onClick?: () => void
}

export default function Link(props: Props) {
  const color = props.color || 'text-blue-500'
  return (
    <A
      target={props.newTab ? '_blank' : undefined}
      href={props.href}
      onClick={props.onClick}
      class={cn(
        color,
        props.selected
          ? 'brightness-150'
          : `hover:brightness-150  hover:text-shadow-xs hover:text-shadow-inherit`,
      )}
    >
      {props.children}
    </A>
  )
}
