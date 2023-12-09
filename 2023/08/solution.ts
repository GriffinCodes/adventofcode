import {DOUBLE_NEWLINE, exampleFile, NEWLINE, part, readFile} from "../../shared/util"

let input: string[] = readFile(exampleFile() ?? 'input').split(DOUBLE_NEWLINE)

let nodes: { [name: string]: { name: string, left: string, right: string } } = {}
let instructions: string = input.shift();

input.shift().split(NEWLINE).map(line => {
	for (let matcher of line.matchAll(/(\w+) = \((\w+), (\w+)\)/g))
		nodes[matcher[1]] = {name: matcher[1], left: matcher[2], right: matcher[3]}
})

function stepUntil(node: string, predicate: (node: string) => boolean, steps: number = 0) {
	while (!predicate(node)) {
		let instruction = instructions.charAt(steps++ % instructions.length)
		node = instruction == 'R' ? nodes[node].right : nodes[node].left
	}
	return steps;
}

if (!exampleFile()?.includes('3'))
	console.log(stepUntil('AAA', node => node == 'ZZZ'))

let ghosts: string[] = Object.keys(nodes).filter(key => key.endsWith('A'))
console.log(ghosts.map(ghost => stepUntil(ghost, node => node.endsWith('Z'))).lcm());
