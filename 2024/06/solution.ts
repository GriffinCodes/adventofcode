import { Color, Coordinate, debug, Direction, example, NEWLINE, readFile } from "../../shared/util";

enum State {
	START,
	EMPTY,
	OBSTACLE,
	TRAVELLED,
}

class Cell {
	constructor(
		public state: State,
		public potential: boolean,
		public temp: boolean = false
	) {}
}

class Grid {
	grid: Cell[][] = []

	isOutOfBounds(location: Coordinate): boolean {
		return this.grid[location.row]?.[location.col] == null
	}

	get(location: Coordinate) {
		return this.grid[location.row]?.[location.col]
	}

	forEach(func: (coordinate: Coordinate) => void) {
		for (let row = 0; row < this.grid.length; row++)
			for (let col = 0; col < this.grid[row].length; col++)
				func(Coordinate.of(row, col))
	}

	coordinates(): Coordinate[] {
		let coordinates = []
		for (let row = 0; row < this.grid.length; row++)
			for (let col = 0; col < this.grid[row].length; col++)
				coordinates.push(Coordinate.of(row, col))
		return coordinates;
	}
}

let grid = new Grid();

readFile(example() ? 'example' : 'input').split(NEWLINE).forEach(line => {
	if (line == '')
		return;

	grid.grid.push(line.split('').map(char => {
		let state: State;
		if (char == '.')
			state = State.EMPTY
		if (char == '#')
			state = State.OBSTACLE
		if (char == '^')
			state = State.START

		return new Cell(state, false);
	}))
});

let start = grid.coordinates().find(coordinate => grid.get(coordinate).state == State.START)
debug('start', start)

let potentialObstacles = 0;
let tries = 0;

function travel(originalLocation: Coordinate, originalDirection: Direction, fake: boolean = false): boolean {
	let location = originalLocation
	let direction = originalDirection
	let timesTurned = 0
	while (true) {
		if (tries > 100000000)
			grid.get(location).temp = true

		++timesTurned
		if (fake)
			if (timesTurned >= 100000)
				break

		if (++tries % 10000000 == 0) {
			console.log('tries', tries)
			console.log('potentialObstacles', potentialObstacles)
			console.log('location', location)
		}

		let cell = grid.get(location);
		if (!fake)
			cell.state = State.TRAVELLED

		let next = location.move(direction)
		if (grid.isOutOfBounds(next))
			break

		let nextCell = grid.get(next);
		if (!fake)
			// before moving, we pretend there's an obstacle in front - will we reach the same location travelling the same direction?
			if (travel(location, direction.turnRight(), true)) {
				nextCell.potential = true;
				++potentialObstacles
			}

		if (nextCell.state == State.OBSTACLE)
			direction = direction.turnRight()
		else {
			location = next
		}

		if (fake) {
			if (location == originalLocation) {
				if (direction == originalDirection.turnLeft()) {
					return true
				} else
					return false
			}
		}
	}

	return false
}

travel(start, Direction.U);

console.log(grid.coordinates().filter(coordinate => grid.get(coordinate).state == State.TRAVELLED).length)
console.log(potentialObstacles)

function printGrid() {
	grid.grid.forEach(row => {
		console.log(row.map(cell => {
			return (cell.temp ? Color.RED : Color.RESET) + (cell.potential ? 'O' : cell.state == State.OBSTACLE ? '#' : '.') + Color.RESET
		}).join(''))
	})
	grid.forEach(coordinate => grid.get(coordinate).temp = false)
}

printGrid();

if (!grid.get(Coordinate.of(6, 3)).potential) console.log('wrong 1')
if (!grid.get(Coordinate.of(7, 6)).potential) console.log('wrong 2')
if (!grid.get(Coordinate.of(7, 7)).potential) console.log('wrong 3')
if (!grid.get(Coordinate.of(8, 1)).potential) console.log('wrong 4')
if (!grid.get(Coordinate.of(8, 3)).potential) console.log('wrong 5')
if (!grid.get(Coordinate.of(9, 7)).potential) console.log('wrong 6')

// ....#.....
// .........#
// ..........
// ..#.......
// .......#..
// ..........
// .#.O......
// ......OO#.
// #O.O......
// ......#O..
