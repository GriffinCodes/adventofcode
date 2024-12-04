import { Color, Coordinate, debug, Direction, doPart, example, NEWLINE, part, readFile } from "../../shared/util";

class Cell {
	constructor(public character: string) {}
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
}

let grid = new Grid();
let lookingFor = "XMAS"
let part1 = 0;

readFile(example() ? 'example' : 'input').split(NEWLINE).forEach(line => {
	if (line == '')
		return;

	grid.grid.push(line.split('').map(char => new Cell(char)))
});

function check(coordinate: Coordinate, direction: Direction, character: string = "X") {
	if (grid.isOutOfBounds(coordinate))
		return

	let state = grid.get(coordinate)
	debug(`${Color.RESET}Inspecting ${coordinate.row},${coordinate.col} ${state.character} ${character}`)
	if (state.character != character) {
		debug(`${Color.RED}  Incorrect character, ending chain`)
		return;
	}

	if (character == lookingFor.charAt(lookingFor.length - 1)) {
		debug(`${Color.GREEN}  Found final character at ${coordinate.row},${coordinate.col} ${character}`)
		++part1;
		return;
	}

	let nextCharacter = lookingFor.charAt(lookingFor.indexOf(character) + 1);
	debug(`${Color.YELLOW}  Found ${character}, checking for next character ${nextCharacter}`)
	check(coordinate.move(direction), direction, nextCharacter)
}

if (doPart(1)) {
	grid.forEach(coordinate => {
		for (let direction of Direction.values())
			check(coordinate, direction, lookingFor.charAt(0))
	})

	console.log('part1', part1)
}

if (doPart(2)) {
	let part2 = 0;
	grid.forEach(coordinate => {
		if (grid.get(coordinate).character != 'A')
			return;

		let matches = 0;
		for (let direction of Direction.corners())
			if (grid.get(coordinate.move(direction))?.character == 'M')
				if (grid.get(coordinate.move(direction.getOpposite()))?.character == 'S')
					++matches

		if (matches == 2)
			++part2;
	})

	console.log('part2', part2)
}
