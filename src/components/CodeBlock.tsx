import './CodeBlock.css'

interface Props {
  code?: string
}

export default function CodeBlock(props: Props) {
  return props.code ? <div innerHTML={props.code} class='w-full' /> : null
}
