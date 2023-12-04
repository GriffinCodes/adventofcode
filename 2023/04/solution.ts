import {example, NEWLINE, readFile} from "../../shared/util";

class Card {
	public matchingNumbers: number = 0;
	public copies: number = 1;

	constructor(public name: string, public winningNumbers: number[], public myNumbers: number[]) {
		this.matchingNumbers = this.myNumbers.filter(myNumber => this.winningNumbers.includes(myNumber)).length;
	}

	value(): number {
		return this.matchingNumbers == 0 ? 0 : Math.pow(2, this.matchingNumbers) / 2
	}
}

let cards: Card[] = [];
readFile(example() ? 'example' : 'input').split(NEWLINE).forEach(line => {
	for (let matcher of line.matchAll(/Card\s+(\d+): (.*) \| (.*)/g))
		cards.push(new Card(
			matcher[1],
			matcher[2].split(" ").map(num => Number(num)).filter(num => num != 0),
			matcher[3].split(" ").map(num => Number(num)).filter(num => num != 0)
		));
});

for (let index = 0; index < cards.length; index++) {
	let card: Card = cards[index];

	for (let next = index + 1; next <= index + card.matchingNumbers; next++)
		cards[next].copies += card.copies;
}

console.log(cards.map(card => card.value()).sum());
console.log(cards.map(card => card.copies).sum());