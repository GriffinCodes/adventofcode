import fs from 'fs';

export function arg(...options: string[]) {
	return !!findArg(...options);
}

export function argValue(...options: string[]) {
	return findArg(...options)?.split("=")[1];
}

export function findArg(...options: string[]) {
	return process.argv.find(arg => {
		for (let option of options)
			if (arg.startsWith(option))
				return true;

		return false;
	});
}

export function example(): boolean {
	return arg("-e", "--example");
}

export function verbose(): boolean {
	return arg("-v", "--verbose");
}

export function debug(...obj: any[]) {
	if (verbose())
		console.log(...obj)
}

export function exampleFile(): string {
	let argument = findArg("-e", "--example");
	return !argument ? null : "example" + (argument?.split("=")[1] ?? "");

}

export function inputFile(): string {
	let argument = findArg("-i", "--input");
	return !argument ? "input" : "input" + (argument?.split("=")[1] ?? "");

}

export function part(): number {
	return findArg("-p", "--part")?.split("=")[1].asNumber();
}

export function doPart(number: number): boolean {
	return part() == null || part() == number
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
		asNumber(): number;
		asNumberArray(splitter: string | RegExp): number[];
		sort(): string;
		includesAll(characters: string): boolean;
		lastCharacter(): string;
	}

	interface Object {
		sortByValue(): { [key: string]: number };
		sortByValueReverse(): { [key: string]: number };
		print(): void;
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

String.prototype.asNumber = function(): number {
	return Number(this)
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

String.prototype.lastCharacter = function(): string {
	return this.charAt(this.length - 1)
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

Object.prototype.print = function(): void {
	console.log(this);
}

export const NEWLINE = /\r?\n/;
export const ALL_NEWLINE = /\r?\n/g;
export const DOUBLE_NEWLINE = /\r?\n\r?\n/;
export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
export const NOT_EMPTY_STRING = str => str != ''

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

export function readFile(filename?: string): string {
	return fs.readFileSync(filename ?? exampleFile() ?? inputFile(), 'utf8');
}

export function readFileLines(config?: { filename: string, split: RegExp }): string[] {
	return readFile(config?.filename).split(config?.split ?? NEWLINE).filter(NOT_EMPTY_STRING)
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

	static corners(): Direction[] {
		return Direction.values().filter(direction => direction.vertical != 0 && direction.horizontal != 0);
	}

	public turnRight() {
		if (this == Direction.R) return Direction.D
		if (this == Direction.D) return Direction.L
		if (this == Direction.L) return Direction.U
		if (this == Direction.U) return Direction.R
	}

	public turnLeft() {
		if (this == Direction.R) return Direction.U
		if (this == Direction.U) return Direction.L
		if (this == Direction.L) return Direction.D
		if (this == Direction.D) return Direction.R
	}
}

export type PathSymbol2 = {
	exit1: Direction,
	exit2: Direction,
	symbol: string,
	keyboardSymbol: string
	reversible?: boolean
}

export type PathSymbol = {
	last: Direction,
	current: Direction,
	symbol: string,
	keyboardSymbol: string
	reversible?: boolean
}

export class PathSymbols2 {

	static getFromEntryPoint(entry: Direction): PathSymbol2 {
		return PathSymbols2.symbols.find(symbol => symbol.exit1 == entry.getOpposite() || symbol.exit2 == entry.getOpposite());
	}

	static getFromKeyboardSymbol(keyboardSymbol: string): PathSymbol2 {
		return PathSymbols2.symbols.find(symbol => symbol.keyboardSymbol == keyboardSymbol) ?? {exit1: null, exit2: null, symbol: keyboardSymbol, keyboardSymbol: keyboardSymbol};
	}

	static symbols: PathSymbol2[] = [
		{exit1: Direction.R, exit2: Direction.L, symbol: "─", keyboardSymbol: "-"},
		{exit1: Direction.U, exit2: Direction.D, symbol: "│", keyboardSymbol: "|"},
		{exit1: Direction.U, exit2: Direction.R, symbol: "└", keyboardSymbol: "L"},
		{exit1: Direction.L, exit2: Direction.U, symbol: "┘", keyboardSymbol: "J"},
		{exit1: Direction.D, exit2: Direction.R, symbol: "┌", keyboardSymbol: "F"},
		{exit1: Direction.L, exit2: Direction.D, symbol: "┐", keyboardSymbol: "7"},
	]
}

export class PathSymbols {
	static getFromDirections(last: Direction, current: Direction): PathSymbol {
		return PathSymbols.symbols.find(symbol => symbol.last == last && symbol.current == current);
	}

	static getFromKeyboardSymbol(keyboardSymbol: string): PathSymbol {
		return PathSymbols.symbols.find(symbol => symbol.keyboardSymbol == keyboardSymbol) ?? {last: null, current: null, symbol: keyboardSymbol, keyboardSymbol: keyboardSymbol};
	}

	static symbols: PathSymbol[] = [
		{last: Direction.R, current: Direction.R, symbol: "─", keyboardSymbol: "-", reversible: true},
		{last: Direction.L, current: Direction.L, symbol: "─", keyboardSymbol: "-", reversible: true},

		{last: Direction.U, current: Direction.U, symbol: "│", keyboardSymbol: "|", reversible: true},
		{last: Direction.D, current: Direction.D, symbol: "│", keyboardSymbol: "|", reversible: true},

		{last: Direction.D, current: Direction.R, symbol: "└", keyboardSymbol: "L"},
		{last: Direction.L, current: Direction.U, symbol: "└", keyboardSymbol: "L"},

		{last: Direction.R, current: Direction.U, symbol: "┘", keyboardSymbol: "J"},
		{last: Direction.D, current: Direction.L, symbol: "┘", keyboardSymbol: "J"},

		{last: Direction.U, current: Direction.R, symbol: "┌", keyboardSymbol: "F"},
		{last: Direction.L, current: Direction.D, symbol: "┌", keyboardSymbol: "F"},

		{last: Direction.R, current: Direction.D, symbol: "┐", keyboardSymbol: "7"},
		{last: Direction.U, current: Direction.L, symbol: "┐", keyboardSymbol: "7"}
	]
}

export class Coordinate {
	static instances: { [key: number]: { [key: number]: Coordinate }} = {};

	private constructor(public row: number, public col: number) {}

	static of(row: number, col: number): Coordinate {
		if (!this.instances[row])
			this.instances[row] = {};

		let rows: any = this.instances[row];
		if (!rows[col])
			rows[col] = new Coordinate(row, col);

		return rows[col];
	}

	move(direction: Direction): Coordinate {
		return Coordinate.of(this.row + direction.vertical, this.col + direction.horizontal);
	}

	equals(other: Coordinate) {
		return this.row == other.row && this.col == other.col;
	}

	toString(): string {
		return `${this.row},${this.col}`
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

	hasPrevious() {
		return this.index() - 1 >= 0;
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

export class GenericGrid<Cell> {
	grid: Cell[][] = []

	addRow(row: Cell[]) {
		return this.grid.push(row)
	}

	get(location: Coordinate) {
		return this.grid[location.row]?.[location.col]
	}

	isOutOfBounds(location: Coordinate): boolean {
		return this.get(location) == null
	}

	coordinates() {
		return this.grid.flatMap((row, rowIndex) =>
			row.map((_, columnIndex) => Coordinate.of(rowIndex, columnIndex))
		);
	}

	forEach(func: (coordinate: Coordinate) => void) {
		this.coordinates().forEach(coordinate => func(coordinate))
	}
}
