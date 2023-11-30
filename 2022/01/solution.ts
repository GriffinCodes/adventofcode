import { DOUBLE_NEWLINE, NEWLINE, readFile, sum } from "../../shared/util";

let data: string = readFile('input');
let reindeer: number[] = [];
data.split(DOUBLE_NEWLINE).forEach((group: string) => {
	let snacks: number[] = group.split(NEWLINE).map((item: string) => Number(item));
	reindeer.push(sum(snacks));
});

reindeer.sort().reverse();
console.log(reindeer[0]);
console.log(sum(reindeer.slice(0, 3)));

