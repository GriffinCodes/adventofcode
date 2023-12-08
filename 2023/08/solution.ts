import { DOUBLE_NEWLINE, example, exampleFile, NEWLINE, readFile } from "../../shared/util";

let input: string[] = readFile(exampleFile() ?? 'input').split(DOUBLE_NEWLINE);
let instructions: string = input.shift();

let nodes: { [name: string]: { name: string, left: string, right: string } } = {};

input.shift().split(NEWLINE).map(line => {
	for (let matcher of line.matchAll(/(\w+) = \((\w+), (\w+)\)/g))
		nodes[matcher[1]] = { name: matcher[1], left: matcher[2], right: matcher[3] };
});

let node = nodes['AAA']
let steps = 0

while (node.name != 'ZZZ') {
	let instruction = instructions.charAt(steps % instructions.length)
	node = instruction == 'R' ? nodes[node.right] : nodes[node.left];
	++steps;
}

console.log(steps);

let starting = Object.keys(nodes).filter(key => key.endsWith('A'));

while (!starting.every(node => node.endsWith('Z'))) {
	starting.forEach((node, index) => {
		let instruction = instructions.charAt(steps % instructions.length)
		starting[index] = instruction == 'R' ? nodes[node].right : nodes[node].left;
	})
	++steps;
}

console.log(steps)
