import { debug, doPart, DOUBLE_NEWLINE, example, NEWLINE, part, readFile } from "../../shared/util"

let instructions = readFile(example() ? 'example' : 'input').split(DOUBLE_NEWLINE)
let rules = instructions[0].split(NEWLINE).filter(rule => !!rule)
let updates = instructions[1].split(NEWLINE).filter(update => !!update)

let part1 = 0
let part2 = 0

function fix(update) {
	return update.split(',').sort((a, b) => {
		for (let rule of rules) {
			let _rule = rule.split('|')
			if (a == _rule[0] && b == _rule[1])
				return -1
			if (a == _rule[1] && b == _rule[0])
				return 1
		}
		return 0
	}).join(',')
}

for (let update of updates) {
	let fixed = fix(update)

	debug('checking', update)
	debug('  fixed ', fixed)
	let valid = true
	for (let rule of rules) {
		let _rule = rule.split('|')

		let indexOf1 = update.indexOf(_rule[0])
		let indexOf2 = update.indexOf(_rule[1])
		if (indexOf1 == -1 || indexOf2 == -1)
			continue

		if (indexOf1 > indexOf2) {
			debug('  breaks rule ' + rule)
			valid = false
		}
	}

	let middle = Number(fixed.substring(fixed.length / 2 - 1, fixed.length / 2 + 1))
	debug('  middle', middle)

	if (valid) {
		debug('  valid')
		part1 += middle
	} else {
		debug('  invalid')
		part2 += middle
	}
}

console.log('part1', part1)
console.log('part2', part2)
