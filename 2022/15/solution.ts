import { ansi, Color, Coordinate, Direction, example, NEWLINE, readFile } from "../../shared/util";

let sensors: Set<Sensor> = new Set();

class Sensor {
	constructor(public location: Coordinate, public beacon: Coordinate) {}

	distanceToBeacon() {
		return this.distance(this.beacon);
	}

	distance(to: Coordinate): number {
		return distanceBetween(this.location, to)
	}

	static isWithinReachOfAnySensor(location: Coordinate) {
		for (let sensor of sensors) {
			if (sensor.distance(location) <= sensor.distanceToBeacon()) {
				return true;
			}
		}

		return false;
	}

	getAllCoordinatesJustOutOfReach(): Coordinate[] {
		let coordinates: Coordinate[] = [];
		let rowDifference = this.distanceToBeacon() + 1;
		let colDifference = 0;

		let add = (coordinate: Coordinate) => {
			if (!Sensor.isWithinReachOfAnySensor(coordinate))
				coordinates.push(coordinate);
		}

		while (rowDifference > 0) {
			add(Coordinate.of(this.location.row + rowDifference--, this.location.col + colDifference++));
		}
		while (colDifference > 0) {
			add(Coordinate.of(this.location.row + rowDifference--, this.location.col + colDifference--));
		}
		while (rowDifference < 0) {
			add(Coordinate.of(this.location.row + rowDifference++, this.location.col + colDifference--));
		}
		while (colDifference < 0) {
			add(Coordinate.of(this.location.row + rowDifference++, this.location.col + colDifference++));
		}

		return coordinates;
	}
}

function distanceBetween(from: Coordinate, to: Coordinate): number {
	return Math.abs(from.col - to.col) + Math.abs(from.row - to.row);
}

readFile(example() ? 'example' : 'input').split(NEWLINE).forEach(line => {
	for (let matcher of line.matchAll(/Sensor at (.*): closest beacon is at (.*)/g))
		sensors.add(new Sensor(Coordinate.of(
			Number(matcher[1].replace(/x=(-?\d+), y=(-?\d+)/, "$2")),
			Number(matcher[1].replace(/x=(-?\d+), y=(-?\d+)/, "$1"))
		), Coordinate.of(
			Number(matcher[2].replace(/x=(-?\d+), y=(-?\d+)/, "$2")),
			Number(matcher[2].replace(/x=(-?\d+), y=(-?\d+)/, "$1"))
		)));
})


let minRow = Math.min(...[...sensors].map(sensor => Math.min(sensor.location.row, sensor.beacon.row))) - (example() ? 15 : 1000000);
let maxRow = Math.max(...[...sensors].map(sensor => Math.max(sensor.location.row, sensor.beacon.row))) + (example() ? 15 : 1000000);
let minCol = Math.min(...[...sensors].map(sensor => Math.min(sensor.location.col, sensor.beacon.col))) - (example() ? 15 : 1000000);
let maxCol = Math.max(...[...sensors].map(sensor => Math.max(sensor.location.col, sensor.beacon.col))) + (example() ? 15 : 1000000);

let cannotBeBeacon = 0;
for (let col = minCol; col < maxCol; col++) {
	let row = example() ? 9 : 2000000;
	let location: Coordinate = Coordinate.of(row, col);

	for (let sensor of sensors) {
		if (location.equals(sensor.location) || location.equals(sensor.beacon))
			continue;

		if (distanceBetween(location, sensor.location) <= sensor.distanceToBeacon()) {
			++cannotBeBeacon;
			break;
		}
	}
}

console.log(cannotBeBeacon);

all: for (let sensor of sensors) {
	let outOfReach = sensor.getAllCoordinatesJustOutOfReach();
	search: for (let coordinate of outOfReach) {
		for (let direction of Direction.cardinals()) {
			if (!Sensor.isWithinReachOfAnySensor(coordinate.move(direction))) {
				break search;
			}
		}
		console.log(coordinate.col * 4000000 + coordinate.row)
		break all;
	}
}

class State {
	static EMPTY = new State(ansi(Color.BLACK, "."));
	static SENSOR = new State(ansi(Color.GREEN, "S"));
	static BEACON = new State(ansi(Color.BLUE, "B"));
	static COVERED = new State(ansi(Color.GRAY, "#"));
	static OUT_OF_REACH = new State(ansi(Color.RED, "*"))

	constructor(public character: string) {}
}

class Grid {
	grid: State[][] = [];
	minCol: number;
	maxCol: number;
	minRow: number;
	maxRow: number;

	constructor(public sensors: Set<Sensor>) {
		this.minRow = Math.min(...[...sensors].map(sensor => Math.min(sensor.location.row, sensor.beacon.row))) - 15;
		this.maxRow = Math.max(...[...sensors].map(sensor => Math.max(sensor.location.row, sensor.beacon.row))) + 15;
		this.minCol = Math.min(...[...sensors].map(sensor => Math.min(sensor.location.col, sensor.beacon.col))) - 15;
		this.maxCol = Math.max(...[...sensors].map(sensor => Math.max(sensor.location.col, sensor.beacon.col))) + 15;

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
			this.setState(sensor.beacon, State.BEACON)
		})
	}

	print() {
		this.grid.forEach(row => {
			console.log(row.map(state => state.character).join(""))
		})
	}

	move(from: Coordinate, direction: Direction): Coordinate {
		return Coordinate.of(from.row + direction.vertical, from.col + direction.horizontal);
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

			sensor.getAllCoordinatesJustOutOfReach().forEach(outOfReach => {
				if (this.stateAt(outOfReach) == State.EMPTY) {
					this.setState(outOfReach, State.OUT_OF_REACH)
				}
			})
		})
	}
}

if (example()) {
	let cave = new Grid(sensors);
	cave.drawCoverage();
	cave.print();
}