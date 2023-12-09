import {NEWLINE, readFile} from "../../shared/util"

let run = (part: number) => readFile()
	.split(NEWLINE)
	.map(line => line.asNumberArray(" "))
	.map(numbers => {
		let extrapolations = [part == 1 ? numbers : numbers.reverse()]

		let values;
		while ((values = extrapolations.last()).nonZero().isNotEmpty())
			extrapolations.push(values.slice(0, values.length - 1).map((number, index) => values[index + 1] - number))

		return extrapolations.reverse().map(sequence => sequence.last()).sum()
	})
	.sum()
	.print()

run(1)
run(2)
