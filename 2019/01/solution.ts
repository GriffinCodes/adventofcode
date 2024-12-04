import { example, NEWLINE, readFile } from "../../shared/util";

let part1 = 0;
let part2 = 0;

function addFuel(amount) {
	let fuel = Math.floor(amount / 3) - 2;
	part1 += fuel

	if (fuel > 0) {
		part2 += fuel
		addFuel(fuel)
	}
}
readFile(example() ? 'example' : 'input').split(NEWLINE).forEach(line => {
	if (line == '')
		return;

	addFuel(Number(line))
});

console.log(part1)
console.log(part2)
