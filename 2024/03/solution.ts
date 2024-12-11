import { ALL_NEWLINE, readFile } from "../../shared/util"

let part1 = readFile().replace(ALL_NEWLINE, '')
let part2 = part1.replace(/don't\(\).*?($|do\(\))/g, '_')

for (let part of [part1, part2]) {
	let sum = 0

	for (let matcher of part.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g))
		sum += Number(matcher[1]) * Number(matcher[2])

	console.log(sum)
}

