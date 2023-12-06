import { DOUBLE_NEWLINE, example, NEWLINE, NumberRange, readFile } from "../../shared/util";

class Conversion {
	constructor(
		public destinationRangeStart: number,
		public sourceRangeStart: number,
		public rangeLength: number
	) {}

	containsSource(source: number) {
		return this.sourceRangeStart <= source && this.sourceRangeStart + this.rangeLength >= source;
	}

	containsDestination(destination: number) {
		return this.destinationRangeStart <= destination && this.destinationRangeStart + this.rangeLength > destination;
	}

	forwards(source: number) {
		return this.destinationRangeStart + source - this.sourceRangeStart;
	}

	backwards(destination: number) {
		return destination - this.destinationRangeStart + this.sourceRangeStart;
	}
}

class ConversionMap {
	constructor(public conversions: Conversion[]) {}

	forwards(source: number): number {
		return this.conversions.find(conversion => conversion.containsSource(source))?.forwards(source) ?? source;
	}

	backwards(destination: number): number {
		return this.conversions.find(conversion => conversion.containsDestination(destination))?.backwards(destination) ?? destination;
	}
}

function forwards(seed: number) {
	for (let map of maps)
		seed = map.forwards(seed);
	return seed;
}

function backwards(seed: number) {
	for (let map of reversed)
		seed = map.backwards(seed);
	return seed;
}

let groups = readFile(example() ? 'example' : 'input').split(DOUBLE_NEWLINE);

let seeds: number[] = groups.shift().split(": ")[1].asNumberArray(" ");
let seedRanges: NumberRange[] = seeds.chunk(2).map(chunk => new NumberRange(chunk[0], chunk[1]));

let maps: ConversionMap[] = groups.map(group => {
	let conversions = group.split(NEWLINE).slice(1).map(line => {
		for (let matcher of line.matchAll(/(\d+) (\d+) (\d+)/g))
			return new Conversion(Number(matcher[1]), Number(matcher[2]), Number(matcher[3]))
	});
	return new ConversionMap(conversions);
});
let reversed = maps.slice(0).reverse();

console.log(seeds.map(seed => forwards(seed)).min());

let location = -1;
while (true) {
	let seed = backwards(++location);
	if (seedRanges.some(seedRange => seedRange.contains(seed))) {
		console.log(location);
		break;
	}
}
