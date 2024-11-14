import data from './data.txt?raw'

const numbers = [
  'xxxxxxxxxxxxx',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
]

function convertWordNumbers(originalString: string) {
  let newString = originalString
  numbers.forEach((number, index) => {
    newString = newString.replace(new RegExp(number, 'gi'), index.toString())
  })
  if (newString !== originalString) {
    console.log(`Converted ${originalString} to ${newString}`)
  }
  return newString
}

function reverseString(str: string): string {
  return str.split('').reverse().join('')
}

export function answer() {
  let total = 0

  data.split('\n').forEach((line) => {
    if (line.trim().length > 0) {
      const newLine = convertWordNumbers(line)
      const first = newLine.match(/\d/)
      const last = reverseString(newLine).match(/\d/)
      const value = parseInt(`${first}${last}`, 10)
      // console.log(`${newLine.padEnd(40, ' ')}  ${value}`)
      total += value
    }
  })

  // 54331 - too low
  // 53886
  console.log(`The final result is ${total}`)

  return total
}
