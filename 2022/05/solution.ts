import { deepClone, NEWLINE, readFile } from "../../shared/util"

let stacks: string[][] = []
let crates = readFile('input-setup').split(NEWLINE).reverse()
crates.shift()
crates.forEach(row => {
	let i = 0
	row.split(/ {1,4}/).forEach(crate => {
		if (!stacks[i])
			stacks[i] = []
		if (crate.length > 0)
			stacks[i].push(crate)
		i++
	})
})

let part1 = deepClone(stacks)
let part2 = deepClone(stacks)

readFile('input-instructions').split(NEWLINE).forEach(line => {
	let split = line.split(/ ?[a-z]+ ?/).filter(num => num.length > 0)
	let count = Number(split.shift())
	let from = Number(split.shift()) - 1
	let to = Number(split.shift()) - 1

	for (let i = 0; i < count; i++)
		part1[to].push(part1[from].pop())

	part2[to].push(...part2[from].splice(part2[from].length - count))
})

console.log(part1.map(stack => [...stack].pop()).join("").replace(/[\[\]]/g, ""))
console.log(part2.map(stack => [...stack].pop()).join("").replace(/[\[\]]/g, ""))
