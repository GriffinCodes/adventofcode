import {example, NEWLINE, readFile} from "../../shared/util";
import {run} from "node:test";

let runningTotal: number[] = [];
let lastNumber: number = null;
let lastNumber2: number = null;
let increments = 0;
let increments2 = 0;
readFile(example() ? 'example' : 'input').split(NEWLINE).forEach(line => {
	let number: number = Number(line);
	if (lastNumber != null && number > lastNumber)
		++increments;
	lastNumber = number;

	runningTotal.push(number);
	if (runningTotal.length == 3) {
		if (lastNumber2 != null && runningTotal.sum() > lastNumber2)
			++increments2;
		lastNumber2 = runningTotal.sum();
		runningTotal.shift();
	}
})

console.log(increments);
console.log(increments2);