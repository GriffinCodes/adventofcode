import {example, NEWLINE, readFile} from "../../shared/util";

let forward = 0;
let depth1 = 0;
let depth2 = 0;
let aim = 0;
readFile(example() ? 'example' : 'input').split(NEWLINE).forEach(line => {
	for (let matcher of line.matchAll(/forward (\d+)/g)) {
		forward += Number(matcher[1]);
		depth2 += aim * Number(matcher[1]);
	}
	for (let matcher of line.matchAll(/up (\d+)/g)) {
		depth1 -= Number(matcher[1]);
		aim -= Number(matcher[1]);
	}
	for (let matcher of line.matchAll(/down (\d+)/g)) {
		depth1 += Number(matcher[1]);
		aim += Number(matcher[1]);
	}
});

console.log(forward * depth1);
console.log(forward * depth2);