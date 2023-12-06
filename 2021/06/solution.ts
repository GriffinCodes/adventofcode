import {example, readFile} from "../../shared/util";

function increment(ages, age, amount) {
	ages[age] ??= 0;
	ages[age] += amount;
}

type Ages = { [key: number]: number };
let ages: Ages = {};
for (let age of readFile(example() ? 'example' : 'input').asNumberArray(","))
	increment(ages, age, 1);

for (let day = 1; day <= 256; day++) {
	let copy: Ages = {};
	for (let age of Object.keys(ages).map(key => Number(key)).sortNumeric()) {
		if (age == 0) {
			increment(copy, 6, ages[0])
			increment(copy, 8, ages[0])
		} else {
			increment(copy, age - 1, ages[age])
		}
	}
	ages = copy;

	if (day == 80 || day == 256)
		console.log(Object.values(ages).sum());
}
