import { NEWLINE, readFile, sum } from "../../shared/util";

let config = {
	'a': 'rock',
	'b': 'paper',
	'c': 'scissors',
	'x': 'rock',
	'y': 'paper',
	'z': 'scissors'
}

let winnerMap = {
	'rock': 'scissors',
	'paper': 'rock',
	'scissors': 'paper'
}

let configPart2 = {
	'x': (opponent) => winnerMap[opponent],
	'y': (opponent) => opponent,
	'z': (opponent) => Object.keys(winnerMap).filter(key => winnerMap[key] == opponent)[0]
}

let WIN = 6;
let DRAW = 3;
let LOSS = 0;

function play(opponent: string, self: string) {
	let shapeScore = Object.keys(winnerMap).indexOf(self) + 1;
	let result: number;
	if (winnerMap[self] == opponent)
		result = WIN;
	else if (self == opponent)
		result = DRAW;
	else
		result = LOSS;
	return result + shapeScore;
}

let data = readFile('input');
let games: number[] = [];
data.split(NEWLINE).forEach(game => {
	let split = game.toLowerCase().split(" ");
	let result = play(config[split[0]], config[split[1]]);
	games.push(result);
});
console.log(sum(games));

let games2: number[] = [];
data.split(NEWLINE).forEach(game => {
	let split = game.toLowerCase().split(" ");
	let opponent = config[split[0]];
	let result = play(opponent, configPart2[split[1]](opponent));
	games2.push(result);
})
console.log(sum(games2));
