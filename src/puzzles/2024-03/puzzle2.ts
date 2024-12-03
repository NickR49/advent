import data from './input.txt?raw'
import moduleText from './puzzle2.ts?raw'
export { moduleText }

export function answer() {
  let total = 0

  // Match mul(123,4) or do() or don't()
  const regex = /(mul\((\d{1,3}),(\d{1,3})\))|(do\(\))|(don't\(\))/g
  const matches = data.matchAll(regex)

  let include = true
  for (const match of matches) {
    if (match[0].startsWith('don')) {
      include = false
    } else if (match[0].startsWith('do')) {
      include = true
    } else if (include) {
      total += parseInt(match[2]) * parseInt(match[3])
    }
  }

  // 97529391
  return total
}
