import {example, NEWLINE, readFile} from "../../shared/util";

class Card {
	public matchingNumbers: number = 0;
	public value: number = 0;
	public copies: number = 1;

	constructor(public winningNumbers: number[], public myNumbers: number[]) {
		this.matchingNumbers = this.myNumbers.filter(myNumber => this.winningNumbers.includes(myNumber)).length;
		this.value = this.matchingNumbers == 0 ? 0 : Math.pow(2, this.matchingNumbers - 1);
	}
}

let cards: Card[] = [];
readFile(example() ? 'example' : 'input').split(NEWLINE).forEach(line => {
	for (let matcher of line.matchAll(/Card\s+\d+:\s+(.*)\s+\|\s+(.*)/g))
		cards.push(new Card(
			matcher[1].asNumberArray(/\s+/),
			matcher[2].asNumberArray(/\s+/)
		));
});

cards.forEach((card, index) => {
	cards.slice(index + 1, index + card.matchingNumbers + 1).forEach(next => {
		next.copies += card.copies;
	});
});

console.log(cards.map(card => card.value).sum());
console.log(cards.map(card => card.copies).sum());
