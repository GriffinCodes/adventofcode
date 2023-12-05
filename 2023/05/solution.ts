import {DOUBLE_NEWLINE, example, NEWLINE, readFile} from "../../shared/util";

class Range {
	constructor(
		public destinationRangeStart: number,
		public sourceRangeStart: number,
		public rangeLength: number
	) {}

	contains(source: number) {
		return this.sourceRangeStart <= source && this.sourceRangeStart + this.rangeLength >= source;
	}

	containsDestination(destination: number) {
		let diff = this.destinationRangeStart - this.sourceRangeStart;
		let destStart = this.sourceRangeStart + diff;
		return destStart <= destination && destStart + this.rangeLength > destination;
	}

	convert(source: number) {
		return this.destinationRangeStart + (source - this.sourceRangeStart)
	}

	backwards(destination: number) {
		return destination - this.destinationRangeStart + this.sourceRangeStart;
	}
}
class ConversionMap {
	constructor(
		public from: string,
		public to: string,
		public ranges: Range[]
	) {}

	convert(source: number): number {
		return this.ranges.find(range => range.contains(source))?.convert(source) ?? source;
	}

	backwards(destination: number): number {
		return this.ranges.find(range => range.containsDestination(destination))?.backwards(destination) ?? destination;
	}
}
let input = readFile(example() ? 'example' : 'input').split(DOUBLE_NEWLINE);
let seeds: number[] = input.shift().split(": ")[1].asNumberArray(" ");
let maps: ConversionMap[] = [];

input.forEach(group => {
	let from: string;
	let to: string;
	let ranges: Range[] = [];
	group.split(NEWLINE).forEach(line => {
		for (let matcher of line.matchAll(/(\w+)-to-(\w+) map:/g)) {
			from = matcher[1];
			to = matcher[2];
		}
		for (let matcher of line.matchAll(/(\d+) (\d+) (\d+)/g)) {
			ranges.push(new Range(Number(matcher[1]), Number(matcher[2]), Number(matcher[3])))
		}
	});
	maps.push(new ConversionMap(from, to, ranges))
});

function convertForwards(seed: number) {
	for (let map of maps)
		seed = map.convert(seed);
	return seed;
}

function convertBackwards(seed: number) {
	for (let map of [...maps].reverse())
		seed = map.backwards(seed);
	return seed;
}

console.log(seeds.map(seed => convertForwards(seed)).min());

class NumberRange {
	constructor(public start: number, public range: number) {}

	contains(number: number) {
		return this.start <= number && this.start + this.range >= number;
	}
}

let seedRanges: NumberRange[] = [];
let iterator = seeds.iterator();
while (iterator.hasNext()) {
	seedRanges.push(new NumberRange(Number(iterator.next()), Number(iterator.next())));
}

let result = 0;
while (true) {
	let backwards = convertBackwards(result);
	if (seedRanges.some(seedRange => seedRange.contains(backwards))) {
		console.log(result);
		break;
	}
	result++;
}
