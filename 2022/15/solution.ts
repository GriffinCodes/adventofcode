import { Direction, example, NEWLINE, readFile } from "../../shared/util";

type Coordinate = { row: number, col: number };
type Sensor = { location: Coordinate, closestBeacon: Coordinate };

class State {
	static EMPTY = new State(".");
	static SENSOR = new State("S");
	static BEACON = new State("B");
	static COVERED = new State("#");

	constructor(public character) {}
}

class Grid {
	grid: State[][] = [];
	minCol: number;
	maxCol: number;
	minRow: number;
	maxRow: number;

	constructor(public sensors: Sensor[]) {
		this.minRow = Math.min(...sensors.map(sensor => Math.min(sensor.location.row, sensor.closestBeacon.row))) - 15;
		this.maxRow = Math.max(...sensors.map(sensor => Math.max(sensor.location.row, sensor.closestBeacon.row))) + 15;
		this.minCol = Math.min(...sensors.map(sensor => Math.min(sensor.location.col, sensor.closestBeacon.col))) - 15;
		this.maxCol = Math.max(...sensors.map(sensor => Math.max(sensor.location.col, sensor.closestBeacon.col))) + 15;

		this.fillGrid();
		this.draw();
	}

	offsetCol(col: number) {
		return col - this.minCol;
	}

	offsetRow(row: number) {
		return row - this.minRow;
	}

	private fillGrid() {
		for (let row = this.offsetRow(this.minRow); row <= this.offsetRow(this.maxRow); row++) {
			let line = [];
			for (let col = this.offsetCol(this.minCol); col <= this.offsetCol(this.maxCol); col++)
				line.push(State.EMPTY)
			this.grid.push(line);
		}
	}

	draw() {
		this.sensors.forEach(sensor => {
			this.setState(sensor.location, State.SENSOR)
			this.setState(sensor.closestBeacon, State.BEACON)
		})
	}

	print() {
		this.grid.forEach(row => {
			console.log(row.map(state => state.character).join(""))
		})
	}

	move(from: Coordinate, direction: Direction): Coordinate {
		return { row: from.row + direction.vertical, col: from.col + direction.horizontal };
	}

	stateAt(coordinate: Coordinate): State {
		return this.grid[this.offsetRow(coordinate.row)]?.[this.offsetCol(coordinate.col)];
	}

	setState(coordinate: Coordinate, state: State) {
		this.grid[this.offsetRow(coordinate.row)][this.offsetCol(coordinate.col)] = state;
	}

	drawCoverage() {
		this.sensors.forEach(sensor => {
			let covered: Coordinate[] = [sensor.location];
			let foundBeacon = false;
			while (true) {
				if (foundBeacon)
					break;

				for (let location of [...covered]) {
					for (let direction of Direction.cardinals()) {
						let checking = this.move(location, direction);
						if (covered.find(coordinate => checking.row == coordinate.row && checking.col == coordinate.col)) {
							continue;
						}

						if (this.stateAt(checking) == State.BEACON) {
							foundBeacon = true;
						} else {
							this.setState(checking, State.COVERED);
							covered.push(checking)
						}
					}
				}
			}
		})
	}
}

let sensors = readFile(example() ? 'example' : 'input').split(NEWLINE).map(line => {
	let split = line.replace(/(Sensor at | closest beacon is at )/g, "").split(":")
	return <Sensor>{
		location: {
			row: Number(split[0].replace(/x=(-?\d+), y=(-?\d+)/, "$2")),
			col: Number(split[0].replace(/x=(-?\d+), y=(-?\d+)/, "$1"))
		},
		closestBeacon: {
			row: Number(split[1].replace(/x=(-?\d+), y=(-?\d+)/, "$2")),
			col: Number(split[1].replace(/x=(-?\d+), y=(-?\d+)/, "$1"))
		}
	}
})

let cave = new Grid(sensors);
cave.drawCoverage();
cave.print();
