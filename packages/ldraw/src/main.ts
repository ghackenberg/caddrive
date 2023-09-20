export class Color {

}

export class Vector {
    constructor(public x: number, public y: number, public z: number) {

    }
}

export class Matrix {
    constructor(public a: number, public b: number, public c: number, public d: number, public e: number, public f: number, public g: number, public h: number, public i: number) {

    }
}

export class Transform {
    constructor(public position: Vector, public orientation: Matrix) {

    }
}

export abstract class Entry {

}

export class Comment extends Entry {
    constructor(public text: string) {
        super()
    }
}

export class Command extends Entry {
    constructor(public name: string, public parameters: string) {
        super()
    }
}

export class Reference extends Entry {
    constructor(public color: Color, public transform: Transform, public file: File) {
        super()
    }
}

export abstract class Shape extends Entry {
    constructor(public color: Color) {
        super()
    }
}

export class Line extends Shape {
    constructor(color: Color, public points: Vector, public secondPoint: Vector) {
        super(color)
    }
}

export class Triangle extends Shape {
    constructor(color: Color, public firstPoint: Vector, public secondPoint: Vector, public thirdPoint: Vector) {
        super(color)
    }
}

export class Quadrilateral extends Shape {
    constructor(color: Color, public firstPoint: Vector, public secondPoint: Vector, public thirdPoint: Vector, public fourthVector: Vector) {
        super(color)
    }
}

export class OptionalLine extends Shape {
    constructor(color: Color, public firstPoint: Vector, public secondPoint: Vector, public firstControlPoint: Vector, public secondControlPoint: Vector) {
        super(color)
    }
}

export class File {
    public entries: Entry[]
    public comments: Comment[]
    public commands: Command[]
    public references: Reference[]
    public shapes: Shape[]
    constructor(public url: string) {

    }
}

export interface Loader {
    load(url: string): string
}

export class Parser {

    constructor(private loader: Loader) {
        // empty
    }

    parseFile(url: string) {
        const text = this.loader.load(url)
        const file = new File(url)

        const lines = text.split('\n')
        for (const data of lines) {
            const entry = this.parseEntry(data)
            if (entry) {
                file.entries.push(entry)
            }
        }

        return file
    }

    parseEntry(data: string) {
        if (data.length == 0) {
            return null
        }
        if (data[0] == '0') {
            if (data.startsWith('0 !')) {
                return this.parseCommand(data)
            } else {
                return this.parseComment(data)
            }
        }
        if (data[0] == '1') {
            return this.parseReference(data)
        }
        if (data[0] == '2') {
            return this.parseLine(data)
        }
        if (data[0] == '3') {
            return this.parseTriangle(data)
        }
        if (data[0] == '4') {
            return this.parseQuadrilateral(data)
        }
        if (data[0] == '5') {
            return this.parseOptionalLine(data)
        }
        return null
    }

    parseCommand(data: string): Command {
        return null
    }

    parseComment(data: string): Comment {
        return null
    }

    parseReference(data: string): Reference {
        return null
    }

    parseLine(data: string): Line {
        return null
    }

    parseTriangle(data: string): Triangle {
        return null
    }

    parseQuadrilateral(data: string): Quadrilateral {
        return null
    }

    parseOptionalLine(data: string): OptionalLine {
        return null
    }

}