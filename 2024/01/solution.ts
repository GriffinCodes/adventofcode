import { example, NEWLINE, readFile } from "../../shared/util";

let left = [];
let right = [];

readFile(example() ? 'example' : 'input').split(NEWLINE).forEach(line => {
	let numbers = line.replace(/ +/g, ' ').split(' ')
	if (numbers.length != 2)
		return;
	console.log(line, numbers)
	left.push(Number(numbers[0]))
	right.push(Number(numbers[1]))
});

left.sort()
right.sort()

console.log(left)
console.log(right)

let totalDiff = 0;

for (let i = 0; i < left.length; i++) {
	let leftI = left[i];
	let rightI = right[i];
	let diff = Math.max(leftI, rightI) - Math.min(leftI, rightI)
	console.log(diff)
	totalDiff += diff;
}

console.log(totalDiff)

let totalSimilarity = 0;
for (let leftElement of left) {
	let count = right.filter(rightElement => rightElement === leftElement).length
	totalSimilarity += leftElement * count
}

console.log(totalSimilarity)
