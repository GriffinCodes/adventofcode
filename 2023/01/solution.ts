import { NEWLINE, readFile, sum, example } from "../../shared/util";

function parseLine(line: string) {
	let firstAndLast = line
			.replace(/\D/g, "")
			.replace(/(\d).*(\d)/g, "$1$2");
	return Number(firstAndLast + (firstAndLast.length == 1 ? firstAndLast : ""));
}

console.log(sum(readFile(example() ? 'example' : 'input')
		.split(NEWLINE)
		.map(line => parseLine(line))));

let spelledOut = {
	"one": 1,
	"two": 2,
	"three": 3,
	"four": 4,
	"five": 5,
	"six": 6,
	"seven": 7,
	"eight": 8,
	"nine": 9,
}

let digits = "(\\d|" + Object.keys(spelledOut).join("|") + ")";
let regex: RegExp = new RegExp("(?=" + digits + ").*" + digits + "", "g");

console.log(sum(readFile(example() ? 'example2' : 'input')
		.split(NEWLINE)
		.map(line => {
			let numbers = [];
			let matcher;
			while ((matcher = regex.exec(line)) !== null) {
				for (let i = 1; i <= 2; i++) {
					let match = matcher[i];
					for (let key of Object.keys(spelledOut)) {
						match = match.replace(key, spelledOut[key])
					}
					numbers.push(match);
				}
			}
			return parseLine(numbers.join(""));
		})));
