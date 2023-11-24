export class Vector {
    constructor(public x: number, public y: number, public z: number) {

    }
}

export class Matrix {
    constructor(public a: number, public b: number, public c: number, public d: number, public e: number, public f: number, public g: number, public h: number, public i: number) {

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
    constructor(public text: string) {
        super()
    }
}

export class Reference extends Entry {
    constructor(public color: number, public position: Vector, public orientation: Matrix, public file: string) {
        super()
    }
}

export abstract class Shape extends Entry {
    constructor(public color: number) {
        super()
    }
}

export class Line extends Shape {
    constructor(color: number, public firstPoint: Vector, public secondPoint: Vector) {
        super(color)
    }
}

export class Triangle extends Shape {
    constructor(color: number, public firstPoint: Vector, public secondPoint: Vector, public thirdPoint: Vector) {
        super(color)
    }
}

export class Quadrilateral extends Shape {
    constructor(color: number, public firstPoint: Vector, public secondPoint: Vector, public thirdPoint: Vector, public fourthVector: Vector) {
        super(color)
    }
}

export class OptionalLine extends Shape {
    constructor(color: number, public firstPoint: Vector, public secondPoint: Vector, public firstControlPoint: Vector, public secondControlPoint: Vector) {
        super(color)
    }
}

export class Model {

    public entries: Entry[]
    public shapes: Shape[]
    
    public comments: Comment[]
    public commands: Command[]
    public references: Reference[]

    private addEntry(entry: Entry) {
        this.entries.push(entry)
    }
    private addShape(shape: Shape) {
        this.addEntry(shape)
        this.shapes.push(shape)
    }

    addComment(comment: Comment) {
        this.addEntry(comment)
        this.comments.push(comment)
    }
    addCommand(command: Command) {
        this.addEntry(command)
        this.commands.push(command)
    }
    addReference(reference: Reference) {
        this.addEntry(reference)
        this.references.push(reference)
    }

    addLine(line: Line) {
        this.addShape(line)
    }
    addTriangle(triangle: Triangle) {
        this.addShape(triangle)
    }
    addQuadliteral(quadliteral: Quadrilateral) {
        this.addShape(quadliteral)
    }
    addOptionalLine(optionalLine: OptionalLine) {
        this.addShape(optionalLine)
    }

}