import { readFileLines } from "../../shared/util"

let part1 = 0
let part2 = 0

readFileLines().forEach(line => {
	let levels = line.split(' ').map(level => Number(level))

	let unsafe = 0
	let originalSign = 0
	let previous = levels.shift()

	for (let current of levels) {
		let diff = Math.abs(current - previous)
		let sign = Math.sign(current - previous)

		if (!originalSign)
			originalSign = sign

		if (sign !== originalSign || !(diff >= 1 && diff <= 3))
			++unsafe

		previous = current
	}

	if (unsafe == 0)
		++part1

	if (unsafe <= 1)
		++part2
})

console.log('part1', part1)
console.log('part2', part2)
