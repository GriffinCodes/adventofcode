import {example, NEWLINE, readFile} from "../../shared/util";

type Color = "red" | "green" | "blue";
type MAXES = { [key in Color]: number; }
type Game = {
	id: number;
	colors: { [key in Color]?: number; }
}

let games: Game[] = [];
let maxes: MAXES = { green: 13, red: 12, blue: 14 }

function colors() {
	return Object.keys(maxes);
}

readFile(example() ? 'example' : 'input').split(NEWLINE).forEach(line => {
	let game: Game = { id: Number(line.replace(/Game (\d+):.*/, "$1")), colors: {} };
	games.push(game);
	for (let group of line.split(":")[1].split(";"))
		for (let count of group.split(","))
			for (let color of colors())
				if (count.includes(color))
					game.colors[color] = Math.max(Number(count.replace(/\D/g, "")), game.colors[color] || 0);
})

games
	.filter(game => colors().every(color => game.colors[color] <= maxes[color]))
	.map(game => game.id)
	.sum()
	.print()

games
	.map(game => colors()
	.map(color => game.colors[color])
	.product())
	.sum()
	.print()