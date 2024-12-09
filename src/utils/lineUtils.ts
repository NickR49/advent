export function getLines(data: string): string[] {
  return data.trimEnd().split(/\r?\n/)
}

export function printLines(lines: string[]): void {
  lines.forEach((line, i) => {
    console.log(`${i}: ${line}`)
  })
}
