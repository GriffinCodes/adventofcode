import {BoundingBox, Coordinate, Direction, example, Iterator, NEWLINE, readFile} from "../../shared/util";

let iterator: Iterator = readFile(example() ? 'example' : 'input').split(NEWLINE).iterator();
let numbers: SchematicNumber[] = [];
let symbols: SchematicSymbol[] = [];

class SchematicNumber {
	length: number;
	boundingBox: BoundingBox;

	constructor(public number: number, location: Coordinate) {
		this.length = String(this.number).length;
		this.boundingBox = new BoundingBox(location.move(Direction.UL), Coordinate.of(location.row + 1, location.col + this.length));
	}
}

class SchematicSymbol {
	constructor(public symbol: string, public location: Coordinate) {}

	adjacents(): SchematicNumber[] {
		return numbers.filter(number => number.boundingBox.includes(this.location));
	}
}

while (iterator.hasNext()) {
	let row = iterator.index();
	let current = iterator.next();

	for (let matcher of current.matchAll(/\d+/g))
		numbers.push(new SchematicNumber(Number(matcher[0]), Coordinate.of(row, matcher.index)));

	for (let matcher of current.matchAll(/[^.\d]/g))
		symbols.push(new SchematicSymbol(matcher[0], Coordinate.of(row, matcher.index)));
}

symbols
	.map(symbol => symbol.adjacents())
	.flat()
	.map(number => number.number)
	.sum()
	.print();

symbols
	.filter(symbol => symbol.symbol == '*' && symbol.adjacents().length == 2)
	.map(symbol => symbol.adjacents().map(number => number.number).product())
	.flat()
	.sum()
	.print()
