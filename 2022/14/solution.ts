import { Direction, NEWLINE, readFile, example } from "../../shared/util";

type Coordinate = { row: number, col: number };
type Line = {from: Coordinate, to: Coordinate}
let lines: Line[] = [];

readFile(example() ? 'example' : 'input').split(NEWLINE).forEach(line => {
    let iterator = line.split(" -> ").iterator();
    let from = iterator.next();
    while (iterator.hasNext()) {
        let to = iterator.next();
        let fromSplit = from.split(",");
        let toSplit = to.split(",");
        lines.push({
            from: { row: Number(fromSplit[1]), col: Number(fromSplit[0]) },
            to: { row: Number(toSplit[1]), col: Number(toSplit[0]) }
        });
        from = to;
    }
});

class State {
    static AIR = new State(".");
    static ROCK = new State("#");
    static SAND = new State("o");
    static HOLE = new State("+");

    constructor(public character) {}
}

class Grid {
    grid: State[][] = [];
    minCol: number;
    maxCol: number;
    minRow: number;
    maxRow: number;

    constructor(public lines: Line[]) {
        this.minRow = 0;
        this.maxRow = Math.max(...lines.map(line => Math.max(line.from.row, line.to.row))) + 4;
        this.minCol = Math.min(...lines.map(line => Math.min(line.from.col, line.to.col))) - (example() ? 20 : 200);
        this.maxCol = Math.max(...lines.map(line => Math.max(line.from.col, line.to.col))) + (example() ? 20 : 200);

        this.fillGrid();
        this.drawLines(lines);
    }

    offsetCol(col: number) {
        return col - this.minCol;
    }

    private fillGrid() {
        for (let row = this.minRow; row < this.maxRow; row++) {
            let line = [];
            for (let col = this.offsetCol(this.minCol); col < this.offsetCol(this.maxCol); col++)
                line.push(State.AIR)
            this.grid.push(line);
        }
        this.grid[0][this.offsetCol(500)] = State.HOLE;
    }

    drawLines(lines: Line[]) {
        lines.forEach(line => {
            let from = line.from;
            let to = line.to;

            if (from.col == to.col)
                for (let row = Math.min(from.row, to.row); row <= Math.max(from.row, to.row); row++)
                    this.grid[row][this.offsetCol(from.col)] = State.ROCK;

            else if (from.row == to.row)
                for (let row = Math.min(from.col, to.col); row <= Math.max(from.col, to.col); row++)
                    this.grid[from.row][this.offsetCol(row)] = State.ROCK;

            else
                console.log("cannot draw diagonal line")
        })
    }

    print() {
        this.grid.forEach(row => {
            console.log(row.map(state => state.character).join(""))
        })
    }

    hole(): Coordinate {
        return { row: 0, col: this.offsetCol(500) };
    }

    move(from: Coordinate, direction: Direction): Coordinate {
        return { row: from.row + direction.vertical, col: from.col + direction.horizontal };
    }

    stateAt(coordinate: Coordinate): State {
        return this.grid[coordinate.row]?.[coordinate.col];
    }

    dropSand(): boolean {
        let from = this.hole();
        while (true) {
            let to = this.move(from, Direction.D);
            let stateAtFrom = this.stateAt(from);
            let stateAtTo = this.stateAt(to);
            if (!stateAtTo) {
                return false; // outside grid
            }

            if (stateAtTo == State.ROCK || stateAtTo == State.SAND) {
                let diagonal;
                diagonal = this.move(from, Direction.DL);
                if (this.stateAt(diagonal) == State.AIR) {
                    from = diagonal;
                    continue;
                }
                diagonal = this.move(from, Direction.DR);
                if (this.stateAt(diagonal) == State.AIR) {
                    from = diagonal;
                    continue;
                }

                this.grid[from.row][from.col] = State.SAND;
                return stateAtFrom != State.HOLE;
            }

            if (stateAtTo == State.AIR) {
                from = to;
                continue;
            }

            console.log("Unhandled state", stateAtTo);
        }
    }

    dropAllSand() {
        while (true) {
            if (!this.dropSand())
                break;
        }

        this.print();
        console.log(this.countSand())
    }

    countSand(): number {
        return this.grid.flat().count(state => state == State.SAND);
    }
}

let cave: Grid = new Grid(lines);
cave.dropAllSand();

cave.drawLines([{from: {row: cave.maxRow - 2, col: cave.minCol}, to: {row: cave.maxRow - 2, col: cave.maxCol - 1}}]);
cave.dropAllSand();