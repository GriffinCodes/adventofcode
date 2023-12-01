import { NEWLINE, readFile, example } from "../../shared/util";

let forest: number[][] = [];
readFile(example() ? 'example' : 'input').split(NEWLINE).forEach(line => {
	let items = line.split("").map(number => Number(number));
	forest.push(items);
});

let outerTrees = ((forest[0].length - 1) * 2) + ((forest.length - 1) * 2);

let innerTrees = 0;
let scenicScores: number[] = [];
for (let row = 1; row < forest.length - 1; row++) {
	for (let column = 1; column < forest[row].length - 1; column++) {
		let tree = forest[row][column];
		let lefts: number[] = [], rights: number[] = [], ups: number[] = [], downs: number[] = [];

		for (let left = 0; left < column; left++) {
			lefts.push(forest[row][left]);
		}
		for (let right = column + 1; right < forest[row].length; right++) {
			rights.push(forest[row][right]);
		}
		for (let up = 0; up < row; up++) {
			ups.push(forest[up][column]);
		}
		for (let down = row + 1; down < forest.length; down++) {
			downs.push(forest[down][column]);
		}

		let visibleLeft = Math.max(...lefts) < tree;
		let visibleRight = Math.max(...rights) < tree;
		let visibleUp = Math.max(...ups) < tree;
		let visibleDown = Math.max(...downs) < tree;

		if (visibleLeft || visibleRight || visibleUp || visibleDown) {
			++innerTrees;
		}

		let scenicScoreCalc = (tree, neighbors) => {
			let index = neighbors.findIndex(neighbor => neighbor >= tree);
			return index == -1 ? neighbors.length : index + 1;
		};

		let scenicLeft = scenicScoreCalc(tree, lefts.reverse());
		let scenicRight = scenicScoreCalc(tree, rights);
		let scenicUp = scenicScoreCalc(tree, ups.reverse());
		let scenicDown = scenicScoreCalc(tree, downs);

		scenicScores.push(scenicLeft * scenicRight * scenicUp * scenicDown);
	}
}

console.log(innerTrees + outerTrees);
console.log(Math.max(...scenicScores));


