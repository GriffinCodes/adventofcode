import {exampleFile, NEWLINE, readFile} from "../../shared/util"

let run = (part: number) => readFile(exampleFile() ?? 'input')
	.split(NEWLINE)
	.map(line => line.asNumberArray(" "))
	.map(numbers => {
		let differences = [part == 1 ? numbers : numbers.reverse()]

		while (differences.last().nonZero().isNotEmpty()) {
			let values = differences.last()
			differences.push(values.slice(0, values.length - 1).map((number, index) => values[index + 1] - number))
		}

		return differences.reverse().reduce((sum, diffs) => sum += diffs.last(), 0)
	})
	.sum()
	.print()

run(1);
run(2);
