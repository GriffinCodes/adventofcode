import {ansi, Color, Coordinate, example, Line, NEWLINE, readFile} from "../../shared/util";

let lines: Line[] = [];
class State {
	count: number = 0;

	print() {
		return this.count == 0 ? ansi(Color.GRAY, ".") : this.count;
	}
}

class Grid {
	grid: State[][] = [];
	minCol: number;
	minRow: number;
	maxCol: number;
	maxRow: number;

	constructor(public lines: Line[]) {
		this.minRow = lines.map(line => line.minRow()).min() - 10;
		this.maxRow = lines.map(line => line.maxRow()).max() + 10;
		this.minCol = lines.map(line => line.minCol()).min() - 10;
		this.maxCol = lines.map(line => line.maxCol()).max() + 10;

		this.fillGrid();
		this.drawLines(lines);
	}

	private fillGrid() {
		for (let row = this.minRow; row <= this.maxRow; row++) {
			let line = [];
			for (let col = this.minCol; col <= this.maxCol; col++)
				line.push(new State())
			this.grid.push(line);
		}
	}

	drawLines(lines: Line[]) {
		lines.forEach(line => {
			let from = line.from;
			let to = line.to;

			if (from.col == to.col)
				for (let row = Math.min(from.row, to.row); row <= Math.max(from.row, to.row); row++)
					++this.grid[row][from.col].count;

			else if (from.row == to.row)
				for (let col = Math.min(from.col, to.col); col <= Math.max(from.col, to.col); col++)
					++this.grid[from.row][col].count

			else {
				let row = from.row;
				let col = from.col;

				if (from.row < to.row)
					if (from.col < to.col)
						while (row <= to.row && col <= to.col)
							++this.grid[row++][col++].count
					else
						while (row <= to.row && col >= to.col)
							++this.grid[row++][col--].count
				else
					if (from.col < to.col)
						while (row >= to.row && col <= to.col)
							++this.grid[row--][col++].count
					else
						while (row >= to.row && col >= to.col)
							++this.grid[row--][col--].count
			}
		})
	}

	print() {
		this.grid.forEach(row => {
			console.log(row.map(state => state.print()).join(""))
		})
	}

}

readFile(example() ? 'example' : 'input').split(NEWLINE).forEach(line => {
	for (let matcher of line.matchAll(/(\d+),(\d+) -> (\d+),(\d+)/g))
		lines.push(new Line(Coordinate.of(Number(matcher[2]), Number(matcher[1])), Coordinate.of(Number(matcher[4]), Number(matcher[3]))))
});

let vents = new Grid(lines);
vents.print();
console.log(vents.grid.flat().count(point => point.count >= 2));