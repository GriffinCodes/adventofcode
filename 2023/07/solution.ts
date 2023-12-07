import { example, NEWLINE, readFile } from "../../shared/util";

let part: number;
let cardOrder: string;

enum HandType {
	FIVE_OF_A_KIND,
	FOUR_OF_A_KIND,
	FULL_HOUSE,
	THREE_OF_A_KIND,
	TWO_PAIR,
	ONE_PAIR,
	HIGH_CARD,
}

class Hand {
	frequency: number[] = Array(cardOrder.length).fill(0);
	type: HandType;
	strength: number;

	constructor(public cards: string, public bid: number) {
		this.frequency = this.determineFrequency();
		this.type = this.getHandType();
		this.strength = this.getHandStrength();
	}

	determineFrequency() {
		let jokers: number = 0;

		for (const card of this.cards.split(""))
			if (part == 2 && card == "J")
				++jokers
			else
				++this.frequency[cardOrder.indexOf(card)];

		this.frequency.sortNumeric().reverse();

		if (part == 2)
			this.frequency[0] += jokers

		return this.frequency.nonZero();
	}

	getHandType(): HandType {
		let countFrequency = (frequency: number): number => {
			return this.frequency.filter(freq => freq == frequency).length;
		}

		if (countFrequency(5) == 1)
			return HandType.FIVE_OF_A_KIND;

		if (countFrequency(4) == 1)
			return HandType.FOUR_OF_A_KIND;

		if (countFrequency(3) == 1 && countFrequency(2) == 1)
			return HandType.FULL_HOUSE;

		if (countFrequency(3) == 1)
			return HandType.THREE_OF_A_KIND;

		if (countFrequency(2) == 2)
			return HandType.TWO_PAIR;

		if (countFrequency(2) == 1)
			return HandType.ONE_PAIR;

		return HandType.HIGH_CARD;
	}

	getHandStrength(): number {
		if (this.type != HandType.HIGH_CARD)
			return this.type;

		return HandType.HIGH_CARD + this.getRankOfCardAtIndex(0)
	}

	getRankOfCardAtIndex(index: number) {
		return cardOrder.indexOf(this.cards.charAt(index));
	}

	compareTo(other: Hand): number {
		if (this.strength == other.strength)
			for (let i = 0; i < this.cards.length; i++)
				if (this.getRankOfCardAtIndex(i) != other.getRankOfCardAtIndex(i))
					return this.getRankOfCardAtIndex(i) - other.getRankOfCardAtIndex(i)

		return this.strength - other.strength
	}
}

let run = () => {
	let result = readFile(example() ? 'example' : 'input')
			.split(NEWLINE)
			.map(line => line.split(" "))
			.map(split => new Hand(split[0], Number(split[1])))
			.sort((hand1, hand2) => hand1.compareTo(hand2))
			.reverse()
			.map((hand, index) => (index + 1) * hand.bid)
			.sum();

	console.log(result);
}

part = 1
cardOrder = "AKQJT98765432"
run()
part = 2
cardOrder = "AKQT98765432J";
run()
