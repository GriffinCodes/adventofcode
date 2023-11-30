import { ALPHABET, deepClone, Direction, GridCoordinate, NEWLINE, readFile, pathSymbols, getPathSymbol } from "../../shared/util";
import { Dir } from "fs";

let example = false;

type Step = { coordinate: GridCoordinate, direction: Direction };
type Path = {
	steps: Step[]
	timesVisitedLetter: { letter: { count: number } }[]
};

let ANSI_RESET = "\u001B[0m";
let ANSI_RED = "\u001B[31m";
let ANSI_GREEN = "\u001B[32m";
let ANSI_YELLOW = "\u001B[33m";

let grid: string[][] = [];
let emptyGrid: string[][] = [];
let starting: GridCoordinate, ending: GridCoordinate;
readFile(example ? 'example' : 'input').split(NEWLINE).forEach(line => {
	if (line.includes("S")) {
		starting = {row: grid.length, col: line.indexOf("S")}
	}
	if (line.includes("E")) {
		ending = {row: grid.length, col: line.indexOf("E")}
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
		timesVisitedOnBestPath[letter] = { count: bestPath.steps.filter(step => letterAt(step.coordinate) == letter).length };
	})
}

function letterAt(coordinate: GridCoordinate) {
	return grid[coordinate.row][coordinate.col];
}

function elevationAt(coordinate: GridCoordinate) {
	let letter = letterAt(coordinate);
	if (letter == 'S') return -1;
	if (letter == 'E') letter = 'z';
	return ALPHABET.indexOf(letter);
}

function printPath(message: string, current: GridCoordinate, path: Path) {
	let gridCopy = deepClone(grid);
	let lastStep: Step = {coordinate: undefined, direction: Direction.R};
	path.steps.forEach(step => {
		let symbol = getPathSymbol(lastStep.direction, step.direction);
		gridCopy[step.coordinate.row][step.coordinate.col] = ANSI_YELLOW + symbol + ANSI_RESET;
		lastStep = step;
	});
	gridCopy[current.row][current.col] = ANSI_RED + "#" + ANSI_RESET;
	console.log(message);
	gridCopy.forEach(row => console.log(row.join("")));
}

function distanceSquaredToEnd(current: GridCoordinate) {
	let a = current.row - ending.row;
	let b = current.col - ending.col;
	return a * a + b * b;
}

function hasVisited(path: { coordinate: GridCoordinate; direction: Direction }[], c: string) {
	return path.find(step => letterAt(step.coordinate) == c);
}


let steps = 0;
let timer = Date.now();
function exploreNeighbors(current: GridCoordinate, path: Path) {
	++steps;
	let letterAtCurrent = letterAt(current);
	let elevationAtCurrent = elevationAt(current);

	// console.log();
	// console.log("Exploring neighbors of", current);

	if (bestPath.steps.length > 0 && path.steps.length > bestPath.steps.length) {
		return;
	}

	let timesVisitedLetterOnBestPath = timesVisitedOnBestPath[letterAtCurrent]?.count;
	let timesVisitedLetterOnCurrentPath = path.timesVisitedLetter[letterAtCurrent]?.count;

	// console.log("Current path:", path.map(step => step.direction.arrow).join(""))
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

	let directions: {direction: Direction, neighbor: GridCoordinate, distance: number}[] = [];
	for (let direction of Direction.cardinals()) {
		let neighbor: GridCoordinate = {row: current.row + direction.vertical, col: current.col + direction.horizontal}
		directions.push({direction: direction, neighbor: neighbor, distance: distanceSquaredToEnd(neighbor)});
	}

	for (let directionData of directions.sort((d1, d2) => d1.distance - d2.distance)) {
		let direction = directionData.direction;
		let neighbor = directionData.neighbor;
		let newPath = {steps: [...path.steps], timesVisitedLetter: deepClone(path.timesVisitedLetter)};

		let neighborCoordinate = grid[neighbor.row]?.[neighbor.col];
		if (!neighborCoordinate) {
			// console.log("Outside of grid", neighbor);
			continue;
		}

		if (newPath.steps.find(step => step.coordinate.row == neighbor.row && step.coordinate.col == neighbor.col)) {
			// console.log("Already explored", neighbor);
			continue;
		}
		let letterAtNeighbor = letterAt(neighbor);
		let elevationAtNeighbor = elevationAt(neighbor);
		let elevationDifference = elevationAtNeighbor - elevationAtCurrent;

		let describeStep = "(" + letterAtCurrent + "->" + letterAtNeighbor + ")";

		if (elevationDifference > 1) {
			// console.log("Elevation difference too great", elevationDifference, describeStep)
			continue;
		}

		if (!example) {
			if (letterAtCurrent == 'c' && direction == Direction.L) {
				// console.log("Ignoring left while c");
				continue;
			}
			if (letterAtCurrent == 'b' && direction == Direction.D) {
				// console.log("Ignoring down while b");
				continue;
			}

			let allowStepDown = letterAtCurrent == 'r' && letterAtNeighbor == 'p';
			if (!allowStepDown && elevationDifference < 0) {
				// console.log("Ignoring too far step down " + describeStep);
				continue;
			}

			if (!["pqr"].includes(letterAtCurrent)) {
				if ((timesVisitedLetterOnBestPath - 1) < timesVisitedLetterOnCurrentPath) {
					continue;
				}
			}
		}

		newPath.steps.push({coordinate: current, direction: direction});
		newPath.timesVisitedLetter[letterAtCurrent] = {count: (timesVisitedLetterOnCurrentPath || 0) + 1};
		if (letterAtNeighbor == 'E') {
			// console.log("  Reached end in", newPath.length, "steps")
			if (bestPath.steps.length == 0 || bestPath.steps.length > newPath.steps.length) {
				// console.log("  Best match")
				bestPath = newPath;
				computeTimesVisitedOnBestPath();
			}
			continue;
		}

		// console.log("Found possible next step " + direction.arrow + ", continuing")
		exploreNeighbors(neighbor, newPath);
	}
}

exploreNeighbors(starting, {steps: [], timesVisitedLetter: []});

printPath("Best path (" + bestPath.steps.length + "):", ending, bestPath);
