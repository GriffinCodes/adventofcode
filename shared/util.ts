import fs from 'fs';

export function example(): boolean {
	return !!process.argv.find(arg => arg.startsWith("-e") || arg.startsWith("--example"));
}

export function exampleFile(): string {
	let arg = process.argv.find(arg => arg.startsWith("-e") || arg.startsWith("--example"));
	if (!arg)
		return null;

	return "example" + (arg?.split("=")[1] ?? "");
}

export function part(): number {
	let arg = process.argv.find(arg => arg.startsWith("-p") || arg.startsWith("--part"));
	if (!arg)
		return null;

	return Number(arg.split("=")[1]);
}

declare global {
	interface Array<T> {
		count(predicate: (value: T) => boolean): number;
		none(predicate: (value: T) => boolean): boolean;
		peek(func: (value: T) => void): any[];
		sum(): number;
		product(): number;
		min(): number;
		max(): number;
		average(): number;
		median(): number;
		gcd(): number;
		lcm(): number;
		iterator(): Iterator;
		chunk(size: number): T[];
		distinct(): T[];
		nonZero(): T[];
		shuffle(): T[];
		sortNumeric(): T[];
		last(): T;
		first(): T;
		isEmpty(): boolean;
		isNotEmpty(): boolean;
	}

	interface String {
		binaryToDecimal(): number;
		asNumberArray(splitter: string | RegExp): number[];
		sort(): string;
		includesAll(characters: string): boolean;
	}

	interface Object {
		sortByValue(): { [key: string]: number };
		sortByValueReverse(): { [key: string]: number };
	}
}

Array.prototype.count = function(predicate: (value: any) => boolean): number {
	return this.filter(predicate).length;
}

Array.prototype.none = function(predicate: (value: any) => boolean): boolean {
	return !this.every(predicate);
}

Array.prototype.peek = function(func: (value: any) => void): any[] {
	this.forEach(value => func(value));
	return this;
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

Array.prototype.median = function(): number {
	let sorted: number[] = Array.from(<number[]>this).sort((a, b) => a - b);
	let middle = Math.floor(sorted.length / 2);

	if (sorted.length % 2 === 0) {
		return (sorted[middle - 1] + sorted[middle]) / 2;
	}

	return sorted[middle];
}

export function gcd(x = 0, y = 0): number {
	x = Math.abs(x);
	y = Math.abs(y);
	while (y) {
		const t = y;
		y = x % y;
		x = t;
	}
	return x;
}

export function lcm(x?: number, y?: number): number {
	return !x || !y ? 0 : Math.abs((x * y) / gcd(x, y));
}

Array.prototype.lcm = function(): number {
	return this.reduce((a, n) => gcd(a, n), 1)
}

Array.prototype.lcm = function(): number {
	return this.reduce((a, n) => lcm(a, n), 1)
}

Array.prototype.iterator = function(): Iterator {
	return new Iterator(this);
}

Array.prototype.sortNumeric = function(): any[] {
	return this.sort((a, b) => a - b);
}

Array.prototype.nonZero = function(): any[] {
	return this.filter(number => number !== 0);
}

Array.prototype.chunk = function(size: number): any[][] {
	let chunked = [];
	for (let i = 0; i < this.length; i += size)
		chunked.push(this.slice(i, i + size));
	return chunked;
}

// https://stackoverflow.com/a/2450976
Array.prototype.shuffle = function(): any[] {
	let currentIndex = this.length, randomIndex;

	while (currentIndex > 0) {
		randomIndex = Math.floor(Math.random() * currentIndex--);
		[this[currentIndex], this[randomIndex]] = [this[randomIndex], this[currentIndex]];
	}

	return this;
}

Array.prototype.last = function(): any {
	return this[this.length - 1];
}

Array.prototype.first = function(): any {
	return this[0];
}

Array.prototype.isEmpty = function(): boolean {
	return this.length === 0;
}

Array.prototype.isNotEmpty = function(): boolean {
	return this.length !== 0;
}

String.prototype.binaryToDecimal = function(): number {
	return parseInt(this, 2);
}

String.prototype.asNumberArray = function(splitter: string | RegExp): number[] {
	return this.split(splitter).map(number => Number(number));
}

String.prototype.sort = function(): string {
	return this.split("").sort().join("")
}

String.prototype.includesAll = function(characters: string): boolean {
	for (let char of characters.split(""))
		if (!this.includes(char))
			return false;

	return true;
}

Object.prototype.sortByValue = function(): { [key: string]: number } {
	return Object.entries(this)
		.sort((a, b) => Number(a[1]) - Number(b[1]))
		.reduce((sorted, [k, v]) => ({...sorted, [k]: v}), {});
}

Object.prototype.sortByValueReverse = function(): { [key: string]: number } {
	return Object.entries(this)
		.sort((a, b) => Number(b[1]) - Number(a[1]))
		.reduce((sorted, [k, v]) => ({...sorted, [k]: v}), {});
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

export function getPathSymbol(last: Direction, current: Direction): string {
	return pathSymbols.find(symbol => symbol.last == last && symbol.current == current).symbol;
}

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

export class Line {
	constructor(public from: Coordinate, public to: Coordinate) {}

	minRow() {
		return Math.max(this.from.row, this.to.row);
	}

	maxRow() {
		return Math.max(this.from.row, this.to.row);
	}

	minCol() {
		return Math.max(this.from.col, this.to.col);
	}

	maxCol() {
		return Math.max(this.from.col, this.to.col);
	}
}

export class BoundingBox {
	constructor(public min: Coordinate, public max: Coordinate) {}

	includes(coordinate: Coordinate) {
		return coordinate.col >= this.min.col &&
				coordinate.col <= this.max.col &&
				coordinate.row >= this.min.row &&
				coordinate.row <= this.max.row;
	}
}

export class NumberRange {
	public start: number;
	public range: number;
	public end: number;

	constructor(start: number | string, range: number | string) {
		this.start = Number(start);
		this.range = Number(range);
		this.end = this.start + this.range;
	}

	contains(number: number) {
		return this.start <= number && this.end >= number;
	}

	iterator(): number[] {
		let numbers: number[] = [];
		for (let i = this.start; i <= this.end; i++)
			numbers.push(i)
		return numbers;
	}
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
