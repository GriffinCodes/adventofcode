import { Coordinate, Direction, doPart, GenericGrid, Iterator, readFileLines } from "../../shared/util"

class Cell {
	constructor(public character: string) {}
}

let grid = new GenericGrid<Cell>()

readFileLines().forEach(line => grid.addRow(line.split('').map(char => new Cell(char))))

if (doPart(1)) {
	let part1 = 0
	let lookingFor = 'XMAS'.split('')

	function check(coordinate: Coordinate, direction: Direction, iterator: Iterator) {
		if (grid.get(coordinate)?.character != iterator.next())
			return

		if (!iterator.hasNext())
			return ++part1

		check(coordinate.move(direction), direction, iterator)
	}

	grid.forEach(coordinate => {
		for (let direction of Direction.values())
			check(coordinate, direction, lookingFor.iterator())
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
