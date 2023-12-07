import {example, NEWLINE, readFile} from "../../shared/util";

let cardTypes: string = "AKQJT98765432";
type CardCount = { [key: string]: number };
class Hand {
	cardCount: CardCount = {};
	handRank: number;

	constructor(public cards: string, public bid: number) {
		this.countCards();
		this.handRank = this.getHandRank();
	}

	countCards() {
		this.cards.split("").forEach(card => {
			if (!this.cardCount[card])
				this.cardCount[card] = 0;
			++this.cardCount[card];
		});
	}

	getHandRank(): number {
		let keys = Object.keys(this.cardCount);
		let unique = keys.length;
		if (unique == 1) {
			console.log(this.cards, "five of a kind")
			return 100;
		}
		if (unique == 2) {
			if (keys.find(key => this.cardCount[key] == 4)) {
				console.log(this.cards, "four of a kind")
				return 99;
			} else {
				console.log(this.cards, "full house")
				return 98;
			}
		}
		if (unique == 3) {
			if (keys.find(key => this.cardCount[key] == 3)) {
				console.log(this.cards, "three of a kind")
				return 97;
			} else if (keys.count(key => this.cardCount[key] == 2) == 2) {
				console.log(this.cards, "two pair")
				return 96;
			}
		}
		if (unique == 4) {
			console.log(this.cards, "one pair")
			return 95;
		}
		// let sorted = this.cards.split("").sort((a:string, b:string) => cardTypes.indexOf(a) - cardTypes.indexOf(b))
		return this.getRankOfCardAtIndex(0);
	}

	getRankOfCardAtIndex(index: number) {
		let card = this.cards.split("")[index];
		let rank = cardTypes.length - cardTypes.indexOf(card);
		// console.log("index", index, "card", card, "rank", rank)
		return rank;
	}
}

let hands: Hand[] = [];
readFile(example() ? 'example' : 'input').split(NEWLINE).forEach(line => {
	hands.push(new Hand(line.split(" ")[0], Number(line.split(" ")[1])));
})

hands.sort((hand1, hand2) => {
	if (hand1.handRank == hand2.handRank) {
		for (let i = 0; i < hand1.cards.length; i++) {
			if (hand1.getRankOfCardAtIndex(i) != hand2.getRankOfCardAtIndex(i)) {
				return hand1.getRankOfCardAtIndex(i) - hand2.getRankOfCardAtIndex(i)
			}
		}
	}
	return hand1.handRank - hand2.handRank
})

console.log(hands.slice(0).reverse());

console.log(hands.map((hand, index) => (index + 1) * hand.bid).sum());