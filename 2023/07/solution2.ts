import {example, NEWLINE, readFile} from "../../shared/util";

let cardTypes: string = "AKQT98765432J";
type CardCount = { [key: string]: number };
class Hand {
	cardCount: CardCount = {};
	handRank: number;
	jokers: number = 0;

	constructor(public cards: string, public bid: number) {
		this.countCards();
		this.handRank = this.getHandRank();
	}

	countCards() {
		this.cards.split("").forEach(card => {
			if (card == "J") {
				++this.jokers
			} else {
				if (!this.cardCount[card])
					this.cardCount[card] = 0;
				++this.cardCount[card];
			}
		});
		let max = Object.values(this.cardCount).max();
		let maxCard = Object.keys(this.cardCount).find(card => this.cardCount[card] == max);
		if (maxCard) {
			this.cardCount[maxCard] += this.jokers
		} else {
			this.cardCount["J"] = 5;
		}
	}

	getHandRank(): number {
		let keys = Object.keys(this.cardCount);
		let unique = Object.keys(this.cardCount).filter(card => card != "J").length;

		let countFrequency = (freq: number): number => {
			return keys.filter(key => this.cardCount[key] == freq).length;
		}

		console.log("cards", this.cards, "unique", unique, "jokers", this.jokers, "counts", JSON.stringify(this.cardCount));

		if (unique <= 1) {
			if (countFrequency(5)) {
				console.log(this.cards, "five of a kind")
				return 100;
			}
		}
		if (unique == 2) {
			if (countFrequency(4)) {
				console.log(this.cards, "four of a kind")
				return 99;
			} else {
				console.log(this.cards, "full house")
				return 98;
			}
		}
		if (unique == 3) {
			if (countFrequency(3)) {
				console.log(this.cards, "three of a kind")
				return 97;
			} else if (countFrequency(2) == 2) {
				console.log(this.cards, "two pair")
				return 96;
			}
		}
		if (unique == 4) {
			console.log(this.cards, "one pair")
			return 95;
		}
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

console.log(hands.slice(0));

console.log(hands.map((hand, index) => (index + 1) * hand.bid).sum());