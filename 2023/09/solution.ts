import {exampleFile, NEWLINE, readFile} from "../../shared/util"

let forwards = [], backwards = []

readFile(exampleFile() ?? 'input').split(NEWLINE).map(line => line.asNumberArray(" ")).forEach(numbers => {
	let differences = [numbers]

	while (differences.last().nonZero().isNotEmpty()) {
		let values = differences.last()
		differences.push(values.slice(0, values.length - 1).map((number, index) => values[index + 1] - number))
	}

	let forward = 0, backward = 0
	differences.reverse().forEach(diffs => {
		forward = diffs.last() + forward
		backward = diffs.first() - backward
	})
	forwards.push(forward)
	backwards.push(backward)
})

console.log(forwards.sum())
console.log(backwards.sum())
