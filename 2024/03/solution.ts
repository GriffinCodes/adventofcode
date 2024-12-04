import { example, readFile } from "../../shared/util";

let sum = 0;

let line = readFile(example() ? 'example' : 'input')
	.replace(/\r?\n/g, '')
	.replace(/don't\(\).*?($|do\(\))/g, '_________')

for (let matcher of line.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g))
	sum += Number(matcher[1]) * Number(matcher[2]);

console.log(sum)
