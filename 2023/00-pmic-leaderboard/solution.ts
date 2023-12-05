import {ansi, Color, readFile} from "../../shared/util";

let data = JSON.parse(readFile('input')); // https://adventofcode.com/2023/leaderboard/private/view/298396.json

let activeDays: number[] = [1,4,5,6,7];
let ignoreMembers: string[] = ['Robert Renaud'];
let maxScore = Object.keys(data.members).length - ignoreMembers.length;

let puzzles: { [key: string]: string[] } = {};
let members: { [name: string]: number } = {};

for (let day of activeDays) {
	for (let part of [1,2]) {
		Object.keys(data.members)
			.map(member => data.members[member])
			.filter(member => !ignoreMembers.includes(member.name))
			.filter(member => member.completion_day_level?.[day]?.[part])
			.sort((member1, member2) => member1.completion_day_level[day][part].get_star_ts - member2.completion_day_level[day][part].get_star_ts)
			.forEach(member => {
				if (!puzzles[day + "-" + part])
					puzzles[day + "-" + part] = [];
				puzzles[day + "-" + part].push(member.name);
			});
	}
}

Object.values(puzzles).forEach(finishers => {
	let score = maxScore;
	finishers.forEach(finisher => members[finisher] = (members[finisher] ?? 0) + score--)
})

Object.keys(members.sortByValueReverse()).forEach(name => {
	console.log(ansi(Color.YELLOW, String(members[name]).padStart(2)), name);
});
