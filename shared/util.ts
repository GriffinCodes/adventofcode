import fs from 'fs';

export function example(): boolean {
	return process.argv.includes("-e") || process.argv.includes("--example");
}

export const NEWLINE = /\r?\n/;
export const DOUBLE_NEWLINE = /\r?\n\r?\n/;
export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

// https://talyian.github.io/ansicolors/
export class Color {
	static RESET = "\u001B[0m";
	static BLACK = "\u001B[30m"
	static RED = "\u001B[31m"
	static GREEN = "\u001B[32m"
	static YELLOW = "\u001B[33m"
	static BLUE = "\u001B[34m"
	static MAGENTA = "\u001B[35m"
	static CYAN = "\u001B[36m"
	static WHITE = "\u001B[37m"
	static GRAY = "\x1b[38;5;236m"
}

export function ansi(color: string, text: string) {
	return color + text + Color.RESET;
}

export function readFile(filename: string): string {
	return fs.readFileSync(filename, 'utf8');
}

declare global {
	interface Array<T> {
		count(predicate: (value: T) => boolean): number;
		sum(): number;
		product(): number;
		distinct(): T[];
		min(): number;
		max(): number;
		average(): number;
		iterator(): Iterator;
	}

	interface String {
		binaryToDecimal(): number;
		asNumberArray(splitter: string | RegExp): number[];
	}
}

Array.prototype.count = function(predicate: (value: any) => boolean): number {
	return this.filter(predicate).length;
}

Array.prototype.sum = function(): number {
	return this.reduce((a, b) => a + b, 0);
}

Array.prototype.product = function(): number {
	return this.length === 0 ? 0 : this.reduce((a, b) => a * b, 1);
}

Array.prototype.distinct = function(): number[] {
	return Array.from(new Set(this));
}

Array.prototype.min = function(): number {
	return Math.min(...this);
}

Array.prototype.max = function(): number {
	return Math.max(...this);
}

Array.prototype.average = function(): number {
	return this.sum() / this.length;
}

Array.prototype.iterator = function(): Iterator {
	return new Iterator(this);
}

String.prototype.binaryToDecimal = function(): number {
	return parseInt(this, 2);
}

String.prototype.asNumberArray = function(splitter: string | RegExp): number[] {
	return this.split(splitter).map(number => Number(number));
}

export function deepClone(obj: any) {
	return JSON.parse(JSON.stringify(obj));
}

export function isNumber(val: any) {
	return typeof val === 'number';
}

export function isArray(array: any) {
	return Array.isArray(array);
}

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

	static values(): Direction[] {
		return Object.keys(Direction).map(direction => Direction[direction]);
	}

	static cardinals(): Direction[] {
		return Direction.values().filter(direction => direction.vertical == 0 || direction.horizontal == 0);
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

export class Coordinate {
	static instances: Map<number, Map<number, Coordinate>> = new Map();

	private constructor(public row: number, public col: number) {}

	static of(row: number, col: number): Coordinate {
		if (!this.instances.has(row))
			this.instances.set(row, new Map());

		let rows: any = this.instances.get(row);
		if (!rows.has(col))
			rows.set(col, new Coordinate(row, col));

		return rows.get(col);
	}

	move(direction: Direction): Coordinate {
		return Coordinate.of(this.row + direction.vertical, this.col + direction.horizontal);
	}

	equals(other: Coordinate) {
		return this.row == other.row && this.col == other.col;
	}
}

export class BoundingBox {
	constructor(public min: Coordinate, public max: Coordinate) {}

	includes(coordinate: Coordinate) {
		return  coordinate.col >= this.min.col &&
				coordinate.col <= this.max.col &&
				coordinate.row >= this.min.row &&
				coordinate.row <= this.max.row;
	}
}

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

export class Iterator {
	private i = 0;
	private keys = [];

	constructor(private iterable) {
		if (!iterable || typeof iterable != "object")
			return;
		if ('splice' in iterable && 'join' in iterable) { // array
			while (this.keys.length < iterable.length)
				this.keys.push(this.keys.length);
		} else { // map
			for (let key in iterable)
				if (iterable.hasOwnProperty(key))
					this.keys.push(key);
		}
	}

	previous() {
		if (this.index() - 1 >= 0)
			return this.iterable[this.keys[this.index() - 1]];
		return null;
	}

	next() {
		if (this.index() < this.keys.length)
			return this.iterable[this.keys[this.i++]];
		return null;
	}

	peek() {
		if (this.index() < this.keys.length)
			return this.iterable[this.keys[this.index()]];
		return null;
	}

	hasNext() {
		return this.index() < this.keys.length;
	}

	index() {
		return this.i;
	}

	length() {
		return this.keys.length;
	}
}

