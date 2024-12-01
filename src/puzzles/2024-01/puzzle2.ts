import data from './sample.txt?raw'

export function answer() {
  console.log(`${data.split('\n').length} lines to process`)

  // Extract the two lists
  const list1 = data
    .split('\n')
    .map((line) => parseInt(line.split('   ')[0]))
    .sort((a, b) => a - b)
  const list2 = data
    .split('\n')
    .map((line) => parseInt(line.split('   ')[1]))
    .sort((a, b) => a - b)

  let total = 0

  list1.forEach((item) => {
    // Find number of occurrences of this number in right list
    const count = list2.filter((item2) => item2 === item).length
    total += item * count
  })

  // 21790168
  return total
}
