import { NEWLINE, readFile } from "../../shared/util";

let example = false;

class CardinalDirection {
	static U = new CardinalDirection("U", "D", -1, 0);
	static D = new CardinalDirection("D", "U", 1, 0);
	static L = new CardinalDirection("L", "R", 0, -1);
	static R = new CardinalDirection("R", "L", 0, 1);

	constructor(public name, private oppositeName, public vertical: number, public horizontal: number) {}

	getOpposite(): CardinalDirection {
		return CardinalDirection[this.oppositeName];
	}
}

class Instruction {
	public direction: CardinalDirection;
	public distance: number;
	constructor(directionString: string, distanceString: string) {
		this.direction = CardinalDirection[directionString];
		this.distance = Number(distanceString);
	}
}

class Grid {
	gridSize = example ? 11 : 500;
	middle = Math.floor(this.gridSize / 2);

	grid: string[][] = [];
	currentHeadRow = this.middle;
	currentHeadColumn = this.middle;
	currentTailRow = this.middle;
	currentTailColumn = this.middle;
	tailVisited: Set<string> = new Set();

	constructor() {
		for (let i = 0; i < this.gridSize; i++) {
			this.grid.push(".".repeat(this.gridSize).split(""))
		}

		this.grid[this.currentHeadRow][this.currentHeadColumn] = "s";
	}

	move(instruction: Instruction) {
		for (let i = 0; i < instruction.distance; i++) {
			if (this.tailVisited.has(this.currentHeadRow + "-" + this.currentHeadColumn)) {
				this.grid[this.currentHeadRow][this.currentHeadColumn] = "#";
			} else {
				this.grid[this.currentHeadRow][this.currentHeadColumn] = ".";
			}
			this.grid[this.currentTailRow][this.currentTailColumn] = "#";
			this.currentHeadColumn += instruction.direction.horizontal;
			this.currentHeadRow += instruction.direction.vertical;

			if (instruction.direction.horizontal != 0) {
				if (Math.abs(this.currentHeadColumn - this.currentTailColumn) > 1) {
					this.currentTailColumn = this.currentHeadColumn + instruction.direction.getOpposite().horizontal;
					this.currentTailRow = this.currentHeadRow;
				}
			}
			if (instruction.direction.vertical != 0) {
				if (Math.abs(this.currentHeadRow - this.currentTailRow) > 1) {
					this.currentTailRow = this.currentHeadRow + instruction.direction.getOpposite().vertical;
					this.currentTailColumn = this.currentHeadColumn;
				}
			}

			this.grid[this.currentHeadRow][this.currentHeadColumn] = "H";
			this.grid[this.currentTailRow][this.currentTailColumn] = "T";
			this.tailVisited.add(this.currentTailRow + "-" + this.currentTailColumn);
		}
	}

	print() {
		this.grid.forEach(row => {
			console.log(row.join(""));
		});
	}
}

let grid = new Grid();
grid.print();

readFile(example ? 'example' : 'input').split(NEWLINE).forEach(line => {
	// @ts-ignore
	let instruction = new Instruction(...line.split(" "));
	console.log(instruction);
	grid.move(instruction);
});

grid.print();
console.log(grid.tailVisited.size)
