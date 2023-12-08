import {ansi, Color, Coordinate, Direction, example, NEWLINE, readFile} from "../../shared/util";

class State {
	lowPoint: boolean
	basinSize: number = 0
	basin: boolean

	constructor(public height: number) {}

	print(): string {
		if (this.lowPoint)
			return ansi(Color.RED, String(this.height))
		if (this.basin)
			return ansi(Color.YELLOW, String(this.height))
		return String(this.height)
	}
}

class Grid {
	public grid: State[][] = []

	constructor(grid: number[][]) {
		grid.forEach((rows, row) => this.grid.push(rows.map((cols, col) => new State(grid[row][col]))))
	}

	print() {
		this.grid.forEach(row => console.log(row.map(col => col.print()).join("")))
	}

	isOutOfBounds(location: Coordinate): boolean {
		return this.grid[location.row]?.[location.col] == null
	}

	height(location: Coordinate): number {
		return this.stateAt(location).height
	}

	stateAt(location: Coordinate) {
		return this.grid[location.row][location.col]
	}

	canMoveTo(from: Coordinate, to: Coordinate): boolean {
		if (this.isOutOfBounds(to))
			return false

		if (heightmap.height(to) == 9)
			return false

		return heightmap.height(to) > heightmap.height(from)
	}
}

let heightmap = new Grid(readFile(example() ? 'example' : 'input').split(NEWLINE).map(line => line.asNumberArray("")))

heightmap.grid.forEach((rows, row) => {
	rows.forEach((cols, col) => {
		let location: Coordinate = Coordinate.of(row, col)
		for (let cardinal of Direction.cardinals()) {
			let move = location.move(cardinal)
			if (heightmap.isOutOfBounds(move))
				continue

			if (heightmap.height(move) <= heightmap.height(location))
				return
		}
		heightmap.stateAt(location).lowPoint = true

		let exploreBasin = (current: Coordinate) => {
			++heightmap.stateAt(location).basinSize
			heightmap.stateAt(current).basin = true
			for (let cardinal of Direction.cardinals()) {
				if (heightmap.canMoveTo(current, current.move(cardinal))) {
					if (heightmap.stateAt(current.move(cardinal)).basin)
						continue;

					exploreBasin(current.move(cardinal))
				}
			}
		}

		exploreBasin(location)
	})
})


heightmap.print()

console.log(heightmap.grid.flat().filter(point => point.lowPoint).map(point => point.height + 1).sum())
console.log(heightmap.grid.flat().filter(point => point.basinSize > 0).map(point => point.basinSize).sortNumeric().reverse().slice(0, 3).product())

