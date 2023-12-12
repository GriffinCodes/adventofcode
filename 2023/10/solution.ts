import { ansi, Color, Coordinate, Direction, exampleFile, inputFile, NEWLINE, PathSymbol2, PathSymbols2, readFile, arg } from "../../shared/util"
import * as v8 from "v8";

class Point {
    color: string
    steps: number
    explored: boolean

    constructor(public location: Coordinate, public symbol: PathSymbol2) {}

    print(): string {
        let symbol = this.symbol.symbol
        return this.color ? ansi(this.color, symbol) : symbol;
    }
}

class Grid {
    points: Point[][] = []

    isOutOfBounds(location: Coordinate): boolean {
        return this.getPoint(location) == null
    }

    getStartingLocation(): Coordinate {
        let index = this.points.flat().findIndex(point => point.symbol.symbol == 'S')
        return Coordinate.of(Math.floor(index / this.points.length), index % this.points[0].length)
    }

    getPoint(location: Coordinate): Point {
        return this.points[location.row]?.[location.col]
    }

    print() {
        this.points.forEach(row => row.map(point => point.print()).join("").print())
    }
}

let pipes = new Grid()

readFile(exampleFile() ?? inputFile()).split(NEWLINE).forEach(line => {
    pipes.points.push(line.split("").map((char, index) => {
        return new Point(Coordinate.of(pipes.points.length, index), PathSymbols2.getFromKeyboardSymbol(char))
    }))
})

let steps = 0
let start = pipes.getStartingLocation()
pipes.getPoint(start).color = Color.GREEN;

function explore(location: Coordinate, entryDirection: Direction) {
    let moveFrom = location
    let moveTo = location.move(entryDirection)

    if (++steps % 1000 == 0) {
        if (arg("--heapdump"))
            v8.writeHeapSnapshot('dump.heapsnapshot')
        pipes.print()
    }
    console.log(steps)

    if (pipes.isOutOfBounds(moveTo)) {
        console.log("return 1", moveFrom == start, moveTo == start)
        return
    }

    let pointFrom = pipes.getPoint(moveFrom)
    let pointTo = pipes.getPoint(moveTo)

    if (pointTo.explored) {
        console.log("return 2", moveFrom == start, moveTo == start)
        return
    }

    if (pointTo.symbol.symbol == '.' || pointTo.symbol.symbol == 'S') {
        console.log("return 3", moveFrom == start, moveTo == start)
        return
    }

    if (pointTo.symbol.exit1 == entryDirection.getOpposite()) {
        pointTo.explored = true
        pointTo.color = Color.YELLOW
        explore(moveTo, pointTo.symbol.exit2)
    } else if (pointTo.symbol.exit2 == entryDirection.getOpposite()) {
        pointTo.explored = true
        pointTo.color = Color.YELLOW
        explore(moveTo, pointTo.symbol.exit1)
    } else if (start != moveFrom) {
        let colorFrom = pointFrom.color
        let colorTo = pointTo.color
        pointFrom.color = Color.RED
        pointTo.color = Color.MAGENTA
        console.log("Unnecessary move", moveFrom, moveTo, pointTo, entryDirection)
        pipes.print()
        pointFrom.color = colorFrom
        pointTo.color = colorTo
        return
    } else {
        console.log("Start move failed")
    }
}

for (let cardinal of Direction.cardinals())
    explore(start, cardinal)

pipes.print()




