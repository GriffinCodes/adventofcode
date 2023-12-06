import { example, NEWLINE, readFile } from "../../shared/util";

let uniques: {[key: number]: string} = {
	1: "cf",
	4: "bcdf",
	7: "acf",
	8: "abcdefg"
}

class Entry {
	numbers: { [key: string]: number } = {};

	constructor(public signalPatterns: string[], public outputValues: string[]) {
		this.determineNumbers();
	}

	private determineNumbers() {
		let numbers: { [key: string]: string } = {};

		let remainingPatterns = (): string[] => {
			return this.signalPatterns.filter(pattern => !Object.values(numbers).includes(pattern))
		}

		Object.keys(uniques).forEach(key => {
			remainingPatterns().forEach(pattern => {
				if (uniques[key].length == pattern.length)
					numbers[key] = pattern;
			})
		});

		remainingPatterns().forEach(pattern => {
			if (pattern.length == 6) {
				if (pattern.includesAll(numbers['4'])) {
					numbers['9'] = pattern
				} else if (pattern.includesAll(numbers['1'])) {
					numbers['0'] = pattern;
				} else {
					numbers['6'] = pattern;
				}
			}
		});

		remainingPatterns().forEach(pattern => {
			if (pattern.length == 5) {
				if (numbers['6'].includesAll(pattern)) {
					numbers['5'] = pattern;
				} else if (pattern.includesAll(numbers['1'])) {
					numbers['3'] = pattern;
				} else {
					numbers['2'] = pattern;
				}
			}
		});

		Object.keys(numbers).forEach(key => {
			this.numbers[numbers[key].sort()] = Number(key);
		});
	}

	countUniqueOutputValues() {
		let numbers = Object.values(uniques).map(numbers => numbers.length);
		return this.outputValues.count(outputValue => {
			return numbers.includes(outputValue.length);
		})
	}
}

let entries: Entry[] = [];
readFile(example() ? 'example' : 'input').split(NEWLINE).forEach(line => {
	for (let matcher of line.matchAll(/(.*) \| (.*)/g))
		entries.push(new Entry(matcher[1].split(" "), matcher[2].split(" ")));
})

console.log(entries.map(entry => entry.countUniqueOutputValues()).sum());
console.log(entries.map(entry => Number(entry.outputValues.map(value => entry.numbers[value.sort()]).join(""))).sum());
