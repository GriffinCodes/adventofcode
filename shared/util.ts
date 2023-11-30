const fs = require('fs');

export const NEWLINE = /\r?\n/;
export const DOUBLE_NEWLINE = /\r?\n\r?\n/;
export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

export function readFile(filename: string): string {
	return fs.readFileSync(filename, 'utf8');
}

export function sum(numbers: number[]) {
	return numbers.reduce((acc, cur) => acc + cur, 0);
}

export function deepClone(obj: any) {
	return JSON.parse(JSON.stringify(obj));
}

export type GridCoordinate = { row: number, col: number };

export class Direction {
	static R = new Direction("R", "L", "→", 0, 1);
	static U = new Direction("U", "D", "↑", -1, 0);
	static D = new Direction("D", "U", "↓", 1, 0);
	static L = new Direction("L", "R", "←", 0, -1);
	static UL = new Direction("UL", "DR", "↖", -1, -1);
	static UR = new Direction("UR", "DL", "↗", -1, 1);
	static DL = new Direction("DL", "UR", "↙", 1, -1);
	static DR = new Direction("DR", "UL", "↘", 1, 1);

	constructor(public name, private oppositeName, public arrow: string, public vertical: number, public horizontal: number) {}

	getOpposite(): Direction {
		return Direction[this.oppositeName];
	}

	static cardinals(): Direction[] {
		return Object.keys(Direction).map(direction => Direction[direction]).filter(direction => direction.vertical == 0 || direction.horizontal == 0);
	}
}

export let pathSymbols: {last: Direction, current: Direction, symbol: string}[] = [
	{last: Direction.R, current: Direction.R, symbol: "─"},
	{last: Direction.L, current: Direction.L, symbol: "─"},

	{last: Direction.U, current: Direction.U, symbol: "│"},
	{last: Direction.D, current: Direction.D, symbol: "│"},

	{last: Direction.D, current: Direction.R, symbol: "└"},
	{last: Direction.L, current: Direction.U, symbol: "└"},

	{last: Direction.R, current: Direction.U, symbol: "┘"},
	{last: Direction.D, current: Direction.L, symbol: "┘"},

	{last: Direction.U, current: Direction.R, symbol: "┌"},
	{last: Direction.L, current: Direction.D, symbol: "┌"},

	{last: Direction.R, current: Direction.D, symbol: "┐"},
	{last: Direction.U, current: Direction.L, symbol: "┐"}
]

export function getPathSymbol(last: Direction, current: Direction): string {
	return pathSymbols.find(symbol => symbol.last == last && symbol.current == current).symbol;
}

export class ArithmeticOperator {
	static ADD = new ArithmeticOperator("+", (n1, n2) => n1 + n2);
	static SUBTRACT = new ArithmeticOperator("-", (n1, n2) => n1 - n2);
	static MULTIPLY = new ArithmeticOperator("*", (n1, n2) => n1 * n2);
	static DIVIDE = new ArithmeticOperator("/", (n1, n2) => n1 / n2);
	static POWER = new ArithmeticOperator("^", (n1, n2) => Math.pow(n1, n2));

	constructor(public operator: string, private func: any) {
	}

	run(n1, n2): number {
		return this.func(n1, n2);
	}

	static fromOperator(operator: string): ArithmeticOperator {
		return Object.keys(ArithmeticOperator).map(value => ArithmeticOperator[value]).find(value => value.operator == operator);
	}
}

// https://stackoverflow.com/a/2450976
export function shuffle(array) {
	let currentIndex = array.length,  randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex > 0) {

		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}

	return array;
}

