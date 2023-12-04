import { ansi, Color, DOUBLE_NEWLINE, example, NEWLINE, readFile } from "../../shared/util";

class State {
	picked: boolean;

	constructor(public number: number) {}
}

class Board {
	grid: State[][] = [];

	constructor(public lines: string[]) {
		for (let line of lines)
			this.grid.push(line.trim().asNumberArray(/\s+/).map(number => new State(number)));
	}

	draw(draw: number): boolean {
		for (let line of this.grid)
			for (let number of line)
				if (number.number == draw)
					number.picked = true;

		return this.hasWon();
	}

	hasWon() {
		for (let line of this.grid)
			if (line.every(number => number.picked))
				return true;

		for (let line of this.pivot())
			if (line.every(number => number.picked))
				return true;

		return false;
	}

	pivot(): State[][] {
		let pivoted: State[][] = [];
		this.grid.forEach(line => {
			for (let i = 0; i < line.length; i++) {
				if (!pivoted[i])
					pivoted[i] = [];
				pivoted[i].push(line[i]);
			}
		});
		return pivoted;
	}

	print(grid: State[][]) {
		console.log()
		grid.forEach(row => {
			console.log(row.map(state => ansi(state.picked ? Color.GREEN : Color.RESET, String(state.number).padStart(2))).join(" "));
		})
	}

	unpicked() {
		return this.grid.flat().filter(number => !number.picked).map(number => number.number);
	}
}

let input = readFile(example() ? 'example' : 'input').split(DOUBLE_NEWLINE);
let numbers = input.shift().asNumberArray(",");
let boards: Board[] = input.map(board => new Board(board.split(NEWLINE)));
let part1: number;
let part2: number;

for (let number of numbers) {
	for (const board of boards) {
		if (board.draw(number)) {
			if (!part1) {
				part1 = board.unpicked().sum() * number
			}

			if (!part2 && boards.every(board => board.hasWon())) {
				part2 = board.unpicked().sum() * number
			}
		}
	}
}

console.log(part1);
console.log(part2);
