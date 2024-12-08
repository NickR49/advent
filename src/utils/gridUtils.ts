import { getLines } from './lineUtils'

export interface Grid {
  width: number
  height: number
  cells: string[][]
}

export function getGrid(text: string): Grid {
  const data = getLines(text).map((line) => line.split(''))
  return {
    width: data[0].length,
    height: data.length,
    cells: data,
  }
}

export type Direction = [y: number, x: number]
export type Coord = [x: number, y: number]

export function getGridCell(grid: Grid, [x, y]: Coord): string | undefined {
  if (x < 0 || x >= grid.width || y < 0 || y >= grid.height) {
    return undefined
  }
  return grid.cells[y][x]
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
