import { example, NEWLINE, readFile } from "../../shared/util";

let safe = 0;

readFile(example() ? 'example' : 'input').split(NEWLINE).forEach(line => {
	if (line == '')
		return;
	console.log('====')
	console.log(line)

	let levels = line.split(' ').map(level => Number(level))

	let unsafe = 0;
	let last;
	let originalSign
	for (let level of levels) {
		if (!last) {
			last = level
			continue;
		}

		let diff = level - last
		console.log('last', last, 'level', level, 'diff', diff)

		let sign = Math.sign(diff);
		console.log('sign', sign)
		if (!originalSign) {
			originalSign = sign
		}

		diff = Math.abs(diff)

		if (sign != originalSign) {
			console.log('unsafe - switch')
			if (++unsafe == 2)
				return;
		} else if (!(diff >= 1 && diff <= 3)) {
			console.log('unsafe -', diff)
			if (++unsafe == 2)
				return
		}

		last = level
	}

	console.log('safe')
	++safe;
});

console.log(safe)
