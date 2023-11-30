import { NEWLINE, readFile } from "../../shared/util";

let data = readFile('input');

let sum = 0, sumAny = 0;
data.split(NEWLINE).forEach(line => {
	let groups = line.split(",");
	let nums: number[][] = [];
	for (let group of groups) {
		let groupNums = [];
		let range = group.split("-");
		for (let i = Number(range[0]); i <= Number(range[1]); i++) {
			groupNums.push(i);
		}
		nums.push(groupNums);
	}

	console.log(line);
	console.log(nums);

	let firstContainsAllOfSecond = true;
	for (let num of nums[0]) {
		if (nums[1].indexOf(Number(num)) < 0) {
			firstContainsAllOfSecond = false;
		}
	}

	let secondContainsAllOfFirst = true;
	for (let num of nums[1]) {
		if (nums[0].indexOf(Number(num)) < 0) {
			secondContainsAllOfFirst = false;
		}
	}

	let firstContainsAnyOfSecond = false;
	for (let num of nums[0]) {
		if (nums[1].indexOf(Number(num)) >= 0) {
			firstContainsAnyOfSecond = true;
		}
	}

	let secondContainsAnyOfFirst = false;
	for (let num of nums[1]) {
		if (nums[0].indexOf(Number(num)) >= 0) {
			secondContainsAnyOfFirst = true;
		}
	}

	let containsAll = firstContainsAllOfSecond || secondContainsAllOfFirst;
	console.log("containsAll:", containsAll);
	if (containsAll) {
		++sum;
	}

	let containsAny = firstContainsAnyOfSecond || secondContainsAnyOfFirst;
	console.log("containsAny:", containsAny);
	if (containsAny) {
		++sumAny;
	}
})
console.log("sum:", sum);
console.log("sumAny:", sumAny);
