import {NEWLINE, readFile} from "../../shared/util";

class Folder {
	public files: File[] = [];
	public folders: Folder[] = [];

	constructor(public name: string, public parent: Folder) {}

	getFolder(name: string) {
		return this.folders.find(folder => folder.name === name);
	}

	getAbsolutePath = () => {
		let currentFolder: Folder = this;
		let path = this.name;
		while (true) {
			if (!currentFolder.parent) {
				break;
			}
			path = currentFolder.parent.name + "/" + path;
			currentFolder = currentFolder.parent;
		}
		return path;
	}

	getTotalSize = () => {
		return this.folders.map(folder => folder.getTotalSize()).sum() + this.files.map(file => file.size).sum();
	}

	stringify() {
		return JSON.stringify(this, (key, value) => {
			if (key == 'parent') {
				return value?.name;
			} else if (typeof value == 'function') {
				return value();
			} else {
				return value;
			}
		}, 2);
	}
}

class File {
	constructor(public size: number, public name: string) {}
}

let root = new Folder('', null);
let currentFolder = root;
readFile('input').split(NEWLINE).forEach(line => {
	if (line.startsWith("$")) {
		if (line.startsWith("$ cd")) {
			let command = line.replace("$ cd ", "");
			if (command === '/') {
				currentFolder = root;
			} else if (command === '..') {
				currentFolder = currentFolder.parent;
			} else {
				currentFolder = currentFolder.getFolder(command);
			}
		}
	} else {
		if (line.match(/\d+.*/)) {
			currentFolder.files.push(new File(Number(line.split(" ")[0]), line.split(" ")[1]))
		}
		if (line.match(/dir .*/)) {
			currentFolder.folders.push(new Folder(line.split(" ")[1], currentFolder));
		}
	}
});

console.log(root.stringify());

let map = new Map();

function inspect(parent: Folder) {
	map.set(parent.getAbsolutePath(), parent.getTotalSize());
	parent.folders.forEach(folder => {
		map.set(folder.getAbsolutePath(), folder.getTotalSize());
		inspect(folder);
	});
}

inspect(root);

console.log(map);

console.log(Array.from(map.values()).filter((value) => value <= 100_000).sum());

let availSpace = 70_000_000 - root.getTotalSize();
let spaceNeeded = 30_000_000 - availSpace;
let matches = Array.from(map.values()).filter((value) => value >= spaceNeeded);
matches.sort((a, b) => a - b);
console.log(matches.shift().toLocaleString());

