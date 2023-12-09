import { example, NEWLINE, readFile } from "../../shared/util"

let part: number
let cardOrder: string

class Hand {
	strength: number

	constructor(public cards: string, public bid: number) {
		this.strength = this.getStrength()
	}

	getStrength() {
		let frequencies: number[] = Array(cardOrder.length).fill(0)
		let jokers: number = 0

		for (let card of this.cards.split(""))
			if (part == 2 && card == "J")
				++jokers
			else
				++frequencies[cardOrder.indexOf(card)]

		frequencies.sortNumeric().reverse()

		if (part == 2)
			frequencies[0] += jokers

		return frequencies.nonZero().map((frequency, index) => frequency * index).sum();
	}

	getRankOfCardAt(index: number) {
		return cardOrder.indexOf(this.cards.charAt(index))
	}

	compareTo(other: Hand): number {
		if (this.strength == other.strength)
			for (let index = 0; index < this.cards.length; index++)
				if (this.getRankOfCardAt(index) != other.getRankOfCardAt(index))
					return this.getRankOfCardAt(index) - other.getRankOfCardAt(index)

		return this.strength - other.strength
	}
}

let run = () => readFile(example() ? 'example' : 'input')
		.split(NEWLINE)
		.map(line => line.split(" "))
		.map(split => new Hand(split[0], Number(split[1])))
		.sort((hand1, hand2) => hand1.compareTo(hand2))
		.reverse()
		.map((hand, index) => (index + 1) * hand.bid)
		.sum()
		.print()

part = 1
cardOrder = "AKQJT98765432"
run()

part = 2
cardOrder = "AKQT98765432J"
run()
