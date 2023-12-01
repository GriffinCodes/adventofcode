import { readFile } from "../../shared/util";

let activeDays: number[] = [1,4,5,6,7];
let parts = [1,2];
let data = JSON.parse(readFile('input')); // https://adventofcode.com/2023/leaderboard/private/view/298396.json
let maxScore = Object.keys(data.members).length;

let puzzles: Map<string, string[]> = new Map();
let members: Map<string, number> = new Map();

function getPuzzle(key: string) {
	if (!puzzles.has(key))
		puzzles.set(key, []);
	return puzzles.get(key);
}

for (let day of activeDays) {
	for (let part of parts) {
		Object.keys(data.members)
				.filter(member => data.members[member].completion_day_level?.[day]?.[part])
				.sort((m1, m2) => {
					return data.members[m1].completion_day_level[day][part].get_star_ts - data.members[m2].completion_day_level[day][part].get_star_ts;
				}).forEach(finisher => {
					getPuzzle(day + "-" + part).push(data.members[finisher].name);
				});
	}
}

puzzles.forEach((finishers, key) => {
	let score = maxScore;
	finishers.forEach(finisher => {
		members.set(finisher, (members.get(finisher) || 0) + score--);
	})
})

Array.from(members).sort((m1, m2) => m1[1] - m2[1]).reverse().forEach(member => {
	console.log(member[1], member[0]);
})
