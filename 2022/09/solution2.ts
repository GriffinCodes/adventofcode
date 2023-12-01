import { Direction, NEWLINE, readFile, example } from "../../shared/util";

let EMPTY_CHAR = ".";

class Instruction {
	public direction: Direction;
	public distance: number;
	constructor(directionString: string, distanceString: string) {
		this.direction = Direction[directionString];
		this.distance = Number(distanceString);
	}
}

class Knot {
	constructor(public index: string, public row: number, public column: number) {}
}

class Grid {
	gridSize = example() ? 50 : 500;
	middle = Math.floor(this.gridSize / 2);

	knots: Knot[] = [];
	tailVisited: Set<string> = new Set();

	constructor() {
		this.knots.push(new Knot('H', this.middle, this.middle));
		for (let i = 1; i <= 9; i++) {
			this.knots.push(new Knot(String(i), this.middle, this.middle));
		}
	}

	tail(): Knot {
		return [...this.knots].pop();
	}

	move(instruction: Instruction) {
		// console.log("instruction:", instruction);
		for (let i = 0; i < instruction.distance; i++) {
			for (let j = 0; j < this.knots.length; j++) {
				let knot = this.knots[j];
				let nextKnot = this.knots[j + 1];
				// console.log("knot:", knot.index);

				if (j == 0) {
					knot.column += instruction.direction.horizontal;
					knot.row += instruction.direction.vertical;
				}

				if (nextKnot) {
					let followDirection: Direction;

					let l = knot.column - nextKnot.column < Direction.L.horizontal;
					let r = knot.column - nextKnot.column > Direction.R.horizontal;
					let u = knot.row - nextKnot.row < Direction.U.vertical;
					let d = knot.row - nextKnot.row > Direction.D.vertical;

					if (u && r) {
						followDirection = Direction.UR;
					} else if (u && l) {
						followDirection = Direction.UL;
					} else if (d && r) {
						followDirection = Direction.DR;
					} else if (d && l) {
						followDirection = Direction.DL;
					} else if (r) {
						followDirection = Direction.R;
					} else if (l) {
						followDirection = Direction.L;
					} else if (d) {
						followDirection = Direction.D;
					} else if (u) {
						followDirection = Direction.U;
					}

					if (followDirection) {
						// console.log("followDirection:", followDirection);
						if (followDirection.horizontal != 0) {
							nextKnot.column = knot.column - followDirection.horizontal;
							nextKnot.row = knot.row - followDirection.vertical;
						}
						if (followDirection.vertical != 0) {
							nextKnot.row = knot.row - followDirection.vertical;
							nextKnot.column = knot.column - followDirection.horizontal;
						}

						// this.print();
					}
				}

			}

			this.tailVisited.add(this.tail().row + "-" + this.tail().column);
		}
	}

	print() {
		let grid: string[][] = [];
		for (let i = 0; i < this.gridSize; i++) {
			grid.push(EMPTY_CHAR.repeat(this.gridSize).split(""))
		}
		this.tailVisited.forEach(coordinate => {
			grid[Number(coordinate.split("-")[0])][Number(coordinate.split("-")[1])] = "#";
		})
		for (let knot of this.knots) {
			if (grid[knot.row][knot.column].match(/[.#]/)) {
				grid[knot.row][knot.column] = knot.index;
			}
		}
		grid.forEach(row => {
			console.log(row.join(""));
		});
		console.log("=".repeat(this.gridSize))
	}
}

let grid = new Grid();

readFile(example() ? 'example2' : 'input').split(NEWLINE).forEach(line => {
	// @ts-ignore
	let instruction = new Instruction(...line.split(" "));
	grid.move(instruction);
});

grid.print();
console.log(grid.tailVisited.size)
