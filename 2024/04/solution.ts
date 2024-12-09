import { Coordinate, Direction, doPart, GenericGrid, readFileLines } from "../../shared/util"

class Cell {
	constructor(public character: string) {}
}

let grid = new class extends GenericGrid<Cell> {}()

readFileLines().forEach(line => grid.grid.push(line.split('').map(char => new Cell(char))))

if (doPart(1)) {
	let lookingFor = "XMAS"
	let part1 = 0

	function check(coordinate: Coordinate, direction: Direction, expected: string = "X") {
		if (grid.isOutOfBounds(coordinate))
			return

		let cell = grid.get(coordinate)
		if (cell.character != expected)
			return

		if (expected == lookingFor.lastCharacter())
			return ++part1

		let nextCoordinate = coordinate.move(direction);
		let nextCharacter = lookingFor.charAt(lookingFor.indexOf(expected) + 1)
		check(nextCoordinate, direction, nextCharacter)
	}

	grid.forEach(coordinate => {
		for (let direction of Direction.values())
			check(coordinate, direction, lookingFor.charAt(0))
	})

	console.log('part1', part1)
}

if (doPart(2)) {
	let part2 = 0
	grid.forEach(coordinate => {
		if (grid.get(coordinate).character != 'A')
			return

		let matches = 0
		for (let direction of Direction.corners())
			if (grid.get(coordinate.move(direction))?.character == 'M')
				if (grid.get(coordinate.move(direction.getOpposite()))?.character == 'S')
					++matches

		if (matches == 2)
			++part2
	})

	console.log('part2', part2)
}
