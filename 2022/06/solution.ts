import { readFile } from "../../shared/util";

// let expectedSize = 4;
let expectedSize = 14;
let data = readFile('input');
for (let i = 0; i < data.length; i++) {
	let substring = data.substring(i, i + expectedSize);
	let set = new Set(substring.split(""));
	let size = set.size;
	if (size == expectedSize) {
		console.log(i + expectedSize)
		break;
	}
}