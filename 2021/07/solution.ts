import { example, readFile } from "../../shared/util";

function cost(diff: number) {
	return (diff * diff + diff) / 2;
}

let input = readFile(example() ? 'example' : 'input').asNumberArray(",").sortNumeric();
let median = input.median();
console.log(input.map(number => Math.abs(number - median)).sum())
console.log(input.map((number, i) => input.map(number => cost(Math.abs(number - i))).sum()).min());

