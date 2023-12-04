import { DOUBLE_NEWLINE, NEWLINE, readFile } from "../../shared/util";

let reindeer: number[] = readFile('input')
		.split(DOUBLE_NEWLINE)
		.map(group => group.asNumberArray(NEWLINE).sum())
		.sort()
		.reverse();

console.log(reindeer[0]);
console.log(reindeer.slice(0, 3).sum());

