import { example, NEWLINE, readFile } from "../../shared/util";

class Race {
	constructor(public time: number, public distance: number) {}

	min() {
		let i = 0;
		while (true)
			if (++i * (this.time - i) > this.distance)
				return i;
	}

	max() {
		let i = this.min();
		while (true)
			if (++i * (this.time - i) <= this.distance)
				return i - 1;
	}

	diff() {
		return this.max() - this.min() + 1;
	}
}

let races: Race[] = [];
let input = readFile(example() ? 'example' : 'input').split(NEWLINE).map(line => line.split(":")[1].trim());
let times = input[0].asNumberArray(/\s+/);
let distances = input[1].asNumberArray(/\s+/);

times.forEach((time, index) => {
	races.push(new Race(time, distances[index]))
})

races.map(race => race.diff()).product().print()

let race: Race = new Race(
	Number(times.join("")),
	Number(distances.join(""))
);

race.diff().print()



