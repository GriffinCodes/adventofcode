import { ALPHABET, ansi, Color, deepClone, Direction, getPathSymbol, Coordinate, NEWLINE, readFile, example } from "../../shared/util";

type Step = { coordinate: Coordinate, direction: Direction };
type Path = {
	steps: Step[]
	timesVisitedLetter: { letter: { count: number } }[]
};

let grid: string[][] = [];
let emptyGrid: string[][] = [];
let starting: Coordinate, ending: Coordinate;
readFile(example() ? 'example' : 'input').split(NEWLINE).forEach(line => {
	if (line.includes("S")) {
		starting = Coordinate.of(grid.length, line.indexOf("S"))
	}
	if (line.includes("E")) {
		ending = Coordinate.of(grid.length, line.indexOf("E"))
	}
	grid.push(line.split(""));
	emptyGrid.push(".".repeat(line.split("").length).split(""))
});

grid.forEach(row => console.log(row.join("")));
console.log("starting:", starting);
console.log("ending:", ending);

let bestPath: Path = {steps: [], timesVisitedLetter: []};
let timesVisitedOnBestPath: { letter: { count: number } }[] = [];

function computeTimesVisitedOnBestPath() {
	ALPHABET.split("").forEach(letter => {
		timesVisitedOnBestPath[letter] = { count: bestPath.steps.count(step => letterAt(step.coordinate) == letter) };
	})
}

function letterAt(coordinate: Coordinate) {
	return grid[coordinate.row][coordinate.col];
}

function elevationAt(coordinate: Coordinate) {
	let letter = letterAt(coordinate);
	if (letter == 'S') return -1;
	if (letter == 'E') letter = 'z';
	return ALPHABET.indexOf(letter);
}

function printPath(message: string, current: Coordinate, path: Path) {
	let gridCopy = deepClone(grid);
	let lastStep: Step = {coordinate: undefined, direction: Direction.R};
	path.steps.forEach(step => {
		let symbol = getPathSymbol(lastStep.direction, step.direction);
		gridCopy[step.coordinate.row][step.coordinate.col] = ansi(Color.YELLOW, symbol);
		lastStep = step;
	});
	gridCopy[current.row][current.col] = ansi(Color.RED, "#");
	console.log(message);
	gridCopy.forEach(row => console.log(row.join("")));
}

function distanceSquaredToEnd(current: Coordinate) {
	let a = current.row - ending.row;
	let b = current.col - ending.col;
	return a * a + b * b;
}

function hasVisited(path: { coordinate: Coordinate; direction: Direction }[], c: string) {
	return path.find(step => letterAt(step.coordinate) == c);
}

let steps = 0;
let timer = Date.now();

type Lookahead = {
	steps: {

	}[]
}

function debug(...message: any) {
	// console.log(...message);
}

function canMoveTo(from: Coordinate, direction: Direction, to: Coordinate, path: Path) {
	let neighborCoordinate = grid[to.row]?.[to.col];
	if (!neighborCoordinate) {
		debug("Outside of grid", to);
		return false;
	}

	if (path.steps.find(step => step.coordinate.row == to.row && step.coordinate.col == to.col)) {
		debug("Already explored", to);
		return false;
	}

	let letterAtFrom = letterAt(from);
	let letterAtTo = letterAt(to);
	let elevationAtFrom = elevationAt(from);
	let elevationAtTo = elevationAt(to);
	let elevationDifference = elevationAtTo - elevationAtFrom;
	let describeStep = "(" + from + "->" + letterAtTo + ")";

	if (elevationDifference > 1) {
		debug("Elevation difference too great", elevationDifference, describeStep)
		return false;
	}

	if (!example()) {
		if (letterAtFrom == 'c' && direction == Direction.L) {
			debug("Ignoring left while c");
			return false;
		}
		if (letterAtFrom == 'b' && direction == Direction.D) {
			debug("Ignoring down while b");
			return false;
		}

		let allowStepDown = letterAtFrom == 'r' && letterAtTo == 'p';
		if (!allowStepDown && elevationDifference < 0) {
			debug("Ignoring too far step down " + describeStep);
			return false;
		}
	}

	return true;
}

function exploreNeighbors(current: Coordinate, path: Path, breakCondition: () => boolean) {
	if (breakCondition()) {
		return;
	}

	++steps;
	let letterAtCurrent = letterAt(current);

	debug();
	debug("Exploring neighbors of", current);

	if (bestPath.steps.length > 0 && path.steps.length > bestPath.steps.length) {
		return;
	}

	let timesVisitedLetterOnBestPath = timesVisitedOnBestPath[letterAtCurrent]?.count;
	let timesVisitedLetterOnCurrentPath = path.timesVisitedLetter[letterAtCurrent]?.count;

	if (steps % 100000 == 0) {
		let now = Date.now();
		printPath("Steps: " + steps +
				" | Best path: " + bestPath.steps.length +
				" | Current letter: " + letterAtCurrent +
				" | Timings: " + (now - timer) + "ms" +
				" | Times visited on best: " + timesVisitedLetterOnBestPath +
				" | Times visited on current: " + timesVisitedLetterOnCurrentPath +
				" | Current path:", current, path);
		timer = now;
	}

	let directions: {direction: Direction, neighbor: Coordinate, indexOnBestPath: number, distance: number}[] = [];
	for (let direction of Direction.cardinals()) {
		let neighbor: Coordinate = Coordinate.of(current.row + direction.vertical, current.col + direction.horizontal)
		let neighborsIndexOnBestPath = bestPath.steps.reverse().indexOf(bestPath.steps.find(step => step.coordinate.row == neighbor.row && step.coordinate.col == neighbor.col))
		directions.push({direction: direction, neighbor: neighbor, indexOnBestPath: neighborsIndexOnBestPath, distance: distanceSquaredToEnd(neighbor)});
	}

	let sorted = directions.sort((d1, d2) => {
		let distanceComparison = d1.distance - d2.distance;
		if (bestPath.steps.length == 0)
			return distanceComparison;
		if (d1.indexOnBestPath < 0 || d2.indexOnBestPath < 0)
			return distanceComparison;
		if (d1.indexOnBestPath == d2.indexOnBestPath)
			return distanceComparison;

		return d1.indexOnBestPath - d2.indexOnBestPath;
	});

	for (let directionData of sorted) {
		let direction = directionData.direction;
		let neighbor = directionData.neighbor;

		if (!canMoveTo(current, direction, neighbor, path)) {
			continue;
		}

		if (!["pqr"].includes(letterAt(current))) {
			if ((timesVisitedLetterOnBestPath - 1) < timesVisitedLetterOnCurrentPath) {
				return false;
			}
		}

		let newPath = {steps: [...path.steps], timesVisitedLetter: deepClone(path.timesVisitedLetter)};
		newPath.steps.push({coordinate: current, direction: direction});
		newPath.timesVisitedLetter[letterAtCurrent] = {count: (timesVisitedLetterOnCurrentPath || 0) + 1};
		if (letterAt(neighbor) == 'E') {
			debug("  Reached end in", newPath.steps.length, "steps")
			if (bestPath.steps.length == 0 || bestPath.steps.length > newPath.steps.length) {
				debug("  Best match")
				bestPath = newPath;
				computeTimesVisitedOnBestPath();
			}
			continue;
		}

		debug("Found possible next step " + direction.arrow + ", continuing")
		exploreNeighbors(neighbor, newPath, breakCondition);
	}
}

exploreNeighbors(starting, {steps: [], timesVisitedLetter: []}, () => bestPath.steps.length == 514);
exploreNeighbors(starting, {steps: [], timesVisitedLetter: []}, () => bestPath.steps.length == 508);
exploreNeighbors(starting, {steps: [], timesVisitedLetter: []}, () => bestPath.steps.length == 490);
exploreNeighbors(starting, {steps: [], timesVisitedLetter: []}, () => false);

printPath("Best path (" + bestPath.steps.length + "):", ending, bestPath);
