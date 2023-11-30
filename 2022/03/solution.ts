import { ALPHABET, NEWLINE, readFile } from "../../shared/util";

let alphabet = ALPHABET + ALPHABET.toUpperCase();

let sum = 0;
let data: string = readFile('input');
data.split(NEWLINE).forEach(line => {
	let sack1 = line.substring(0, line.length / 2);
	let sack2 = line.substring(line.length / 2);
	for (let char of alphabet.split("")) {
		if (sack1.indexOf(char) >= 0 && sack2.indexOf(char) >= 0) {
			sum += alphabet.indexOf(char) + 1;
		}
	}
});
console.log(sum);

sum = 0;
let i = 0;
let groups: string[][] = [];
let group: string[] = [];
data.split(NEWLINE).forEach(line => {
	group.push(line);
	++i;

	if (i == 3) {
		groups.push(group);
		group = [];
		i = 0;
	}
});

groups.forEach(group => {
	console.log("group:", group);
	chars: for (let char of alphabet.split("")) {
		for (let sack of group) {
			console.log("char:", char, "sack:", sack);
			if (sack.indexOf(char) < 0) {
				continue chars;
			}
		}
		let priority = alphabet.indexOf(char) + 1;
		console.log("common char:", char, "priority:", priority);
		sum += priority;
		break;
	}
});

console.log(sum);
