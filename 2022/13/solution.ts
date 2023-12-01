import {DOUBLE_NEWLINE, isArray, isNumber, NEWLINE, readFile, sum} from "../../shared/util";

let example = false;

type MixedType = [number | number[] | [number[]]]
class Pair {
    correctOrder: boolean;
    index: number;

    constructor(
        public left: MixedType,
        public right: MixedType
    ) {}
}

let exampleAnswers: boolean[] = [true, true, false, true, false, true, false, false]

type Result = {done: boolean, result?: boolean};

function compare(left: any, right: any): Result {
    // console.log("- Compare ", left, "vs", right);

    if (isArray(left) && isArray(right)) {
        if (left.length > 0 && right.length == 0) {
            return {done: true, result: false};
        }

        for (let j = 0; j < Math.max(left.length, right.length); j++) {
            if (left[j] == undefined && right[j] != undefined) {
                return {done: true, result: true};
            }
            if (left[j] != undefined && right[j] == undefined) {
                return {done: true, result: false};
            }

            let result = compare(left[j], right[j]);
            if (result.done) {
                return {done: true, result: result.result};
            }
        }
    }

    if (isNumber(left) && isNumber(right)) {
        if (Number(left) == Number(right)) {
            return {done: false};
        }

        return {done: true, result: Number(left) < Number(right)};
    }

    if (isNumber(left) && isArray(right)) {
        left = [left];
        return compare(left, right);
    }

    if (isArray(left) && isNumber(right)) {
        right = [right];
        return compare(left, right);
    }

    return {done: false};
}

let i = 0;
let pairs = readFile(example ? 'example' : 'input')
    .split(DOUBLE_NEWLINE)
    .map(pair => pair.split(NEWLINE))
    .map(pair => new Pair(JSON.parse(pair[0]), JSON.parse(pair[1])));

pairs.forEach(pair => {
    pair.index = ++i;
    pair.correctOrder = compare(pair.left, pair.right).result;

    if (example) {
        console.log("== Pair ", pair.index, "==");
        console.log("Correct?:", pair.correctOrder + (pair.correctOrder != exampleAnswers[i - 1] ? " (WRONG)" : ""))
    }
});

console.log(sum(pairs.filter(pair => pair.correctOrder).map(pair => pair.index)))

let all: MixedType[] = [];
pairs.forEach(pair => {
    all.push(pair.left);
    all.push(pair.right);
});

let divider1: MixedType = [[2]];
let divider2: MixedType = [[6]];
all.push(divider1)
all.push(divider2)

all.sort((a, b) => compare(a, b).result ? -1 : 1)

let index1 = all.indexOf(divider1) + 1;
let index2 = all.indexOf(divider2) + 1;

console.log(index1, index2, index1 * index2)
