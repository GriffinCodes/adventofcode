import { ansi, Color, DOUBLE_NEWLINE, example, NEWLINE, readFile } from "../../shared/util";

class BoardNumber {
	picked: boolean;

	constructor(public number: number) {}

	print(): string {
		return ansi(this.picked ? Color.GREEN : Color.RESET, String(this.number).padStart(2));
	}
}

class Board {
	grid: BoardNumber[][] = [];

	constructor(public lines: string[]) {
		for (let line of lines)
			this.grid.push(line.trim().asNumberArray(/\s+/).map(number => new BoardNumber(number)));
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

	pivot(): BoardNumber[][] {
		let pivoted: BoardNumber[][] = [];
		this.grid.forEach(line => {
			for (let i = 0; i < line.length; i++)
				(pivoted[i] ||= []).push(line[i]);
		});
		return pivoted;
	}

	print(grid: BoardNumber[][]) {
		console.log()
		grid.forEach(row => console.log(row.map(number => number.print()).join(" ")))
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
			if (!part1)
				part1 = board.unpicked().sum() * number

			if (!part2 && boards.every(board => board.hasWon()))
				part2 = board.unpicked().sum() * number
		}
	}
}

console.log(part1);
console.log(part2);
