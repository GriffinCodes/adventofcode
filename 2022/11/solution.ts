import { NEWLINE, readFile, example } from "../../shared/util";

class Monkey {
	items: number[];
	operation: string;
	divisibleTest: number;
	ifTrue: number;
	ifFalse: number;
	inspections: number = 0;
}

let monkeys: Monkey[] = [];
let monkey: Monkey;
readFile(example() ? 'example' : 'input').split(NEWLINE).forEach(line => {
	line = line.trim();
	for (let matcher of line.matchAll(/Monkey \d+/g)) {
		monkey = new Monkey();
		monkeys.push(monkey);
	}
	for (let matcher of line.matchAll(/Starting items: (.*)/g))
		monkey.items = matcher[1].asNumberArray(", ");
	for (let matcher of line.matchAll(/Operation: new = (.*)/g))
		monkey.operation = matcher[1];
	for (let matcher of line.matchAll(/Test: divisible by (.*)/g))
		monkey.divisibleTest = Number(matcher[1]);
	for (let matcher of line.matchAll(/If true: throw to monkey (.*)/g))
		monkey.ifTrue = Number(matcher[1]);
	for (let matcher of line.matchAll(/If false: throw to monkey (.*)/g))
		monkey.ifFalse = Number(matcher[1]);
});

function debug(...message: any) {
	if (example()) {
		console.log(...message);
	}
}

debug(monkeys)

for (let i = 0; i < 20; i++) {
	for (let i = 0; i < monkeys.length; i++){
		monkey = monkeys[i];
		debug("Monkey " + i);
		while (monkey.items.length > 0) {
			let item = monkey.items.shift();
			++monkey.inspections;
			let arithmetic = eval(monkey.operation.replace(/old/g, String(item)));
			let worryLevel = Math.floor(arithmetic / 3);
			debug("  Monkey inspects an item with a worry level of " + item);
			debug("    Worry level math: " + monkey.operation.replace(/old/g, String(item)) + " = " + arithmetic + " / 3 = " + worryLevel);
			debug("    " + worryLevel + " % " + monkey.divisibleTest + " == " + worryLevel % monkey.divisibleTest);
			if (worryLevel % monkey.divisibleTest == 0) {
				debug("    Throwing to monkey " + monkey.ifTrue)
				monkeys[monkey.ifTrue].items.push(worryLevel);
			} else {
				debug("    Throwing to monkey " + monkey.ifFalse)
				monkeys[monkey.ifFalse].items.push(worryLevel);
			}
		}
	}
}

let sorted = [...monkeys].sort((m1, m2) => m1.inspections - m2.inspections).reverse()
console.log(sorted[0].inspections * sorted[1].inspections);

