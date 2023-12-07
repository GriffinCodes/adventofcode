import { example, NEWLINE, readFile } from "../../shared/util"

let part: number
let cardOrder: string

class Hand {
	frequencies: number[] = Array(cardOrder.length).fill(0)
	strength: number

	constructor(public cards: string, public bid: number) {
		this.frequencies = this.getFrequencies()
		this.strength = this.getStrength()
	}

	getFrequencies() {
		let jokers: number = 0

		for (const card of this.cards.split(""))
			if (part == 2 && card == "J")
				++jokers
			else
				++this.frequencies[cardOrder.indexOf(card)]

		this.frequencies.sortNumeric().reverse()

		if (part == 2)
			this.frequencies[0] += jokers

		return this.frequencies.nonZero()
	}

	getStrength() {
		return this.frequencies.map((frequency, index) => frequency * index).sum();
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

let run = (): number => readFile(example() ? 'example' : 'input')
		.split(NEWLINE)
		.map(line => line.split(" "))
		.map(split => new Hand(split[0], Number(split[1])))
		.sort((hand1, hand2) => hand1.compareTo(hand2))
		.reverse()
		.map((hand, index) => (index + 1) * hand.bid)
		.sum()

part = 1
cardOrder = "AKQJT98765432"
console.log(run())

part = 2
cardOrder = "AKQT98765432J"
console.log(run())
