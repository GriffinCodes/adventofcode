import { NEWLINE, readFile, example } from "../../shared/util";

let cycle = 1;
let x = 1;
let addingNext = false;
let adding = false;
let signalStrength = 0;

let screen: string[][] = [];
for (let i = 0; i < 6; i++) {
	screen.push([])
}

readFile(example() ? 'example' : 'input').split(/[(/\r?\n) ]/).forEach(line => {
	if (line.length == 0) {
		return;
	}

	if (line == 'noop') {
		console.log("Start cycle   " + cycle + ": being executing noop")
	} else if (line == "addx") {
		console.log("Start cycle   " + cycle + ": being executing addx")
		addingNext = true;
	} else if (addingNext) {
		adding = true;
		addingNext = false;
	}

	if ((cycle - 20) % 40 == 0) {
		let increment = cycle * x;
		signalStrength += increment;
		console.log("cycle:", cycle, "| x:", x, "| increment:", increment, "| total:", signalStrength);
	}

	let col = (cycle - 1) % 40;
	let number = Math.abs(col - x);
	let row = Math.floor((cycle - 1) / 40);
	console.log("During cycle  " + cycle + ": CRT draws pixel in position " + (cycle - 1) + " (" + row + "," + col + ")")
	screen[row][col] = number <= 1 ? "#" : ".";
	console.log("Current CRT row:", screen[row].join(""))

	if (adding) {
		x += Number(line);
		let spriteLine: string[] = ".".repeat(40).split("");
		spriteLine[x - 1] = "#"
		spriteLine[x] = "#"
		spriteLine[x + 1] = "#"
		console.log("End of cycle  " + cycle + ": finish executing addx", line, "(Register X is now " + x + ")");
		console.log("Sprite position:", spriteLine.join(""));
		adding = false;
	}

	++cycle;
	console.log("")
});

console.log(signalStrength)

screen.forEach(line => {
	console.log(line.join(""))
})
console.log("=".repeat(40));