import { ArithmeticOperator, NEWLINE, readFile, example } from "../../shared/util";

class Monkey {
	items: number[];
	operation: {operator: ArithmeticOperator, number: number};
	divisibleTest: number;
	ifTrue: number;
	ifFalse: number;
	inspections: number = 0;
}

let monkeys: Monkey[] = [];
let monkey;
readFile(example() ? 'example' : 'input').split(NEWLINE).forEach(line => {
	line = line.trim();
	if (line.startsWith("Monkey")) {
		monkey = new Monkey();
		monkeys.push(monkey);
	} else if (line.startsWith("Starting items: ")) {
		line = line.replace("Starting items: ", "");
		monkey.items = line.split(", ").map(number => Number(number));
	} else if (line.startsWith("Operation: new = old ")) {
		line = line.replace("Operation: new = old ", "");
		let split: string[] = line.split(" ");
		monkey.operation = {operator: ArithmeticOperator.fromOperator(split[0]), number: isNaN(Number(split[1])) ? null : Number(split[1])}
	} else if (line.startsWith("Test: divisible by ")) {
		line = line.replace("Test: divisible by ", "");
		monkey.divisibleTest = Number(line);
	} else if (line.startsWith("If true: throw to monkey ")) {
		line = line.replace("If true: throw to monkey ", "");
		monkey.ifTrue = Number(line);
	} else if (line.startsWith("If false: throw to monkey ")) {
		line = line.replace("If false: throw to monkey ", "");
		monkey.ifFalse = Number(line);
	}
});

console.log(monkeys)

for (let i = 0; i < 20; i++) {
	for (let i = 0; i < monkeys.length; i++){
		monkey = monkeys[i];
		console.log("Monkey " + i);
		while (monkey.items.length > 0) {
			let item = monkey.items.shift();
			++monkey.inspections;
			console.log("  Monkey inspects an item with a worry level of " + item);
			let arithmetic = monkey.operation.operator.run(item, monkey.operation.number || item);
			let worryLevel = Math.floor(arithmetic / 3);
			console.log("    Worry level math: " + item + " " + monkey.operation.operator.operator + " " + (monkey.operation.number || item) + " = " + arithmetic + " / 3 = " + worryLevel);
			console.log("    " + worryLevel + " % " + monkey.divisibleTest + " == " + worryLevel % monkey.divisibleTest);
			if (worryLevel % monkey.divisibleTest == 0) {
				console.log("    Throwing to monkey " + monkey.ifTrue)
				monkeys[monkey.ifTrue].items.push(worryLevel);
			} else {
				console.log("    Throwing to monkey " + monkey.ifFalse)
				monkeys[monkey.ifFalse].items.push(worryLevel);
			}
		}
	}
}

console.log(monkeys)

let sorted = [...monkeys].sort((m1, m2) => m1.inspections - m2.inspections).reverse()
console.log(sorted[0].inspections * sorted[1].inspections);

