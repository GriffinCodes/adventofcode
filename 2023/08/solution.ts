import {DOUBLE_NEWLINE, example, NEWLINE, readFile} from "../../shared/util";

let input: string[] = readFile(example() ? 'example' : 'input').split(DOUBLE_NEWLINE);
let instructions: string = input.shift();

class Node {
	static instances: { [name: string]: Node } = {};

	constructor(public name: string, public left: string, public right: string) {
		Node.instances[name] = this;
	}
}

input.shift().split(NEWLINE).map(line => {
	for (let matcher of line.matchAll(/(\w+) = \((\w+), (\w+)\)/g))
		return new Node(matcher[1], matcher[2], matcher[3]);
});

let node = Node.instances['AAA']
let steps = 0

while (node.name != 'ZZZ') {
	let instruction = instructions.charAt(steps % instructions.length)
	node = instruction == 'R' ? Node.instances[node.right] : Node.instances[node.left];
	++steps;
}
console.log(steps);
