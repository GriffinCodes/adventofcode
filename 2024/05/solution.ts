import { DOUBLE_NEWLINE, NEWLINE, NOT_EMPTY_STRING, readFile } from "../../shared/util"

let instructions = readFile().split(DOUBLE_NEWLINE)
let rules = instructions[0].split(NEWLINE).filter(NOT_EMPTY_STRING).map(rule => rule.split('|'))
let updates = instructions[1].split(NEWLINE).filter(NOT_EMPTY_STRING)

let part1 = 0
let part2 = 0

function fix(update) {
	return update
		.split(',')
		.sort((a, b) => {
			for (let rule of rules) {
				if (a == rule[0] && b == rule[1])
					return -1 // correct order
				if (a == rule[1] && b == rule[0])
					return 1 // incorrect order
			}
			return 0
		})
		.join(',')
}

for (let update of updates) {
	let fixed = fix(update)

	let valid = true
	for (const rule of rules) {
		let indexOf1 = update.indexOf(rule[0])
		let indexOf2 = update.indexOf(rule[1])
		if (indexOf1 != -1 && indexOf2 != -1 && indexOf1 > indexOf2)
			valid = false
	}

	let middleIndex = fixed.length / 2;
	let middle = Number(fixed.substring(middleIndex - 1, middleIndex + 1))

	if (valid)
		part1 += middle
	else
		part2 += middle
}

console.log('part1', part1)
console.log('part2', part2)
