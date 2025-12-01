import { A } from '@solidjs/router'
import { cn } from '~/utils/cn'

interface Props {
  href: string
  color?: 'blue' | 'white'
  hoverColor?: string
  selected?: boolean
  newTab?: boolean
  children?: any
}

export default function Link(props: Props) {
  const color = props.color ?? 'blue'
  return (
    <A
      target={props.newTab ? '_blank' : undefined}
      href={props.href}
      class={cn(
        `text-${color}-500`,
        props.selected
          ? 'brightness-150'
          : `hover:brightness-150  hover:text-shadow-xs hover:text-shadow-${color}-500`,
      )}
    >
      {props.children}
    </A>
  )
}
