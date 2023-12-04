import { example, NEWLINE, readFile } from "../../shared/util";

let lines = readFile(example() ? 'example' : 'input').split(NEWLINE);
let gamma: string = "";
let epsilon: string = "";
let oxygenNumbers: string[] = [...lines];
let co2Numbers: string[] = [...lines];

function getCommonality(lines: string[], index: number) {
	let zeros = lines.count(line => line.charAt(index) == '0')
	let ones = lines.count(line => line.charAt(index) == '1')
	return {
		mostCommon: zeros > ones ? '0' : '1',
		leastCommon: zeros <= ones ? '0' : '1'
	};
}

for (let index = 0; index < lines[0].length; index++) {
	let commonality = getCommonality(lines, index);
	gamma += commonality.mostCommon;
	epsilon += commonality.leastCommon;

	if (oxygenNumbers.length > 1)
		oxygenNumbers = oxygenNumbers.filter(line => line.charAt(index) == getCommonality(oxygenNumbers, index).mostCommon)

	if (co2Numbers.length > 1)
		co2Numbers = co2Numbers.filter(line => line.charAt(index) == getCommonality(co2Numbers, index).leastCommon)
}

console.log(gamma.binaryToDecimal() * epsilon.binaryToDecimal());
console.log(oxygenNumbers[0].binaryToDecimal() * co2Numbers[0].binaryToDecimal());
