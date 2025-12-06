import { getLines } from './lineUtils'

export interface Grid {
  width: number
  height: number
  cells: string[][]
  marked?: boolean[][]
}

export function getGrid(text: string): Grid {
  const data = getLines(text).map((line) => line.split(''))
  const width = data[0].length
  const height = data.length
  return {
    width,
    height,
    cells: data,
    marked: Array(height)
      .fill(false)
      .map(() => Array(width).fill(false)),
  }
}

export type Direction = [y: number, x: number]
export type Coord = [x: number, y: number]

export function getGridCell(grid: Grid, [x, y]: Coord): string | undefined {
  return isInGrid(grid, [x, y]) ? grid.cells[y][x] : undefined
}

export function setGridCell(grid: Grid, [x, y]: Coord, char: string) {
  grid.cells[y][x] = char
}

export function findCell(grid: Grid, char: string): Coord | undefined {
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      if (getGridCell(grid, [x, y]) === char) {
        return [x, y]
      }
    }
  }
}

export function printGrid(grid: Grid): void {
  grid.cells.forEach((line, y) => {
    console.log(`${y}: ${line.join('')}`)
  })
}

export function isInGrid(grid: Grid, [x, y]: Coord): boolean {
  return x >= 0 && x < grid.width && y >= 0 && y < grid.height
}

export function isMarked(grid: Grid, [x, y]: Coord): boolean {
  return isInGrid(grid, [x, y]) && (grid.marked?.[y]?.[x] ?? false)
}

export function markGridCell(grid: Grid, [x, y]: Coord) {
  if (isInGrid(grid, [x, y])) {
    grid.marked![y][x] = true
  }
}

export function resetMarked(grid: Grid) {
  grid.marked = Array(grid.height)
    .fill(false)
    .map(() => Array(grid.width).fill(false))
}

export function isEqualCoord([x1, y1]: Coord, [x2, y2]: Coord): boolean {
  return x1 === x2 && y1 === y2
}

export function containsCoord(coords: Coord[], coord: Coord): boolean {
  return coords.some((c) => isEqualCoord(c, coord))
}

export function uniqueCoords(coords: Coord[]): Coord[] {
  const uniqueCoords: Coord[] = []
  for (let i = 0; i < coords.length; i++) {
    if (!containsCoord(uniqueCoords, coords[i])) {
      uniqueCoords.push(coords[i])
    }
  }
  return uniqueCoords
}

export function addUniqueCoord(coords: Coord[], coord: Coord): Coord[] {
  if (!containsCoord(coords, coord)) {
    coords.push(coord)
  }
  return coords
}

export function compareCoordinates([x1, y1]: Coord, [x2, y2]: Coord): number {
  return y1 - y2 || x1 - x2
}

export function sortCoords(coords: Coord[]): Coord[] {
  return coords.toSorted((a, b) => compareCoordinates(a, b))
}

export function findCellMatches(grid: Grid, char: string): Coord[] {
  const matches: Coord[] = []
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      if (getGridCell(grid, [x, y]) === char) {
        matches.push([x, y])
      }
    }
  }
  return matches
}

export function calcCoord([cx, cy]: Coord, [dx, dy]: Direction): Coord {
  return [cx + dx, cy + dy]
}

export function* gridIterator(grid: Grid): Generator<string, void, unknown> {
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      yield grid.cells[y][x]
    }
  }
}

export function* gridMarkedIterator(
  grid: Grid,
): Generator<boolean | undefined, void, unknown> {
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      yield grid.marked?.[y][x]
    }
  }
}

export function gridMarkedCount(grid: Grid): number {
  return gridMarkedIterator(grid).reduce(
    (acc, value) => (value ? acc + 1 : acc),
    0,
  )
}

// for (const cell of gridIterator(grid)) {
//   console.log(cell)
// }

export const eightDirections: Direction[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

export const fourDirections: Direction[] = [
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, 0],
]

export const diagonalDirections: Direction[] = [
  [-1, -1],
  [1, -1],
  [1, 1],
  [-1, 1],
]
