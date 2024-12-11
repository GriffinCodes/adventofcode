import { readFileLines } from "../../shared/util"

let left = []
let right = []

readFileLines().forEach(line => {
	let numbers = line.split(/ +/)
	left.push(Number(numbers[0]))
	right.push(Number(numbers[1]))
})

left.sort()
right.sort()

let part1 = 0
left.forEach((_, i) =>
	part1 += Math.max(left[i], right[i]) - Math.min(left[i], right[i]))

let part2 = 0
left.forEach((leftElement) =>
	part2 += leftElement * right.filter(rightElement => rightElement === leftElement).length)

console.log('part1', part1)
console.log('part2', part2)
