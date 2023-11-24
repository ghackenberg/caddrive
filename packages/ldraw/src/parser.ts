import { Command, Comment, Line, Matrix, Model, OptionalLine, Quadrilateral, Reference, Triangle, Vector } from "./model"

export class Parser {

    parseText(text: string) {
        const model = new Model()

        const lines = text.split('\n')
        for (const data of lines) {
            this.parseEntry(model, data)
        }

        return model
    }

    private parseEntry(model: Model, data: string) {
        if (data.length == 0) {
            return
        }
        if (data[0] == '0 ') {
            if (data.startsWith('0 !')) {
                this.parseCommand(model, data)
            } else {
                this.parseComment(model, data)
            }
        }
        if (data[0] == '1 ') {
            this.parseReference(model, data)
        }
        if (data[0] == '2 ') {
            this.parseLine(model, data)
        }
        if (data[0] == '3 ') {
            this.parseTriangle(model, data)
        }
        if (data[0] == '4 ') {
            this.parseQuadrilateral(model, data)
        }
        if (data[0] == '5 ') {
            this.parseOptionalLine(model, data)
        }
    }

    private parseCommand(model: Model, data: string) {
        model.addCommand(new Command(data.substring('0 !'.length)))
    }

    private parseComment(model: Model, data: string) {
        if (data.startsWith('0 // ')) {
             model.addComment(new Comment(data.substring('0 // '.length)))
        } else if (data.startsWith('0 //')) {
            model.addComment(new Comment(data.substring('0 //'.length)))
        } else {
            model.addComment(new Comment(data.substring('0 '.length)))
        }
    }

    private parseReference(model: Model, data: string) {
        const item = data.substring('1 '.length).split(' ')
        
        const color = parseInt(item[0])
        
        const x = parseFloat(item[1])
        const y = parseFloat(item[2])
        const z = parseFloat(item[3])

        const position = new Vector(x, y, z)

        const a = parseFloat(item[4])
        const b = parseFloat(item[5])
        const c = parseFloat(item[6])
        const d = parseFloat(item[7])
        const e = parseFloat(item[8])
        const f = parseFloat(item[9])
        const g = parseFloat(item[10])
        const h = parseFloat(item[11])
        const i = parseFloat(item[12])

        const orientation = new Matrix(a, b, c, d, e, f, g, h, i)

        const file = item[13]
        
        model.addReference(new Reference(color, position, orientation, file))
    }

    private parseLine(model: Model, data: string) {
        const item = data.substring('2 '.length).split(' ')

        const color = parseInt(item[0])

        const x1 = parseFloat(item[1])
        const y1 = parseFloat(item[2])
        const z1 = parseFloat(item[3])

        const firstPoint = new Vector(x1, y1, z1)

        const x2 = parseFloat(item[4])
        const y2 = parseFloat(item[5])
        const z2 = parseFloat(item[6])

        const secondPoint = new Vector(x2, y2, z2)

        model.addLine(new Line(color, firstPoint, secondPoint))
    }

    private parseTriangle(model: Model, data: string) {
        const item = data.substring('3 '.length).split(' ')

        const color = parseInt(item[0])

        const x1 = parseFloat(item[1])
        const y1 = parseFloat(item[2])
        const z1 = parseFloat(item[3])

        const firstPoint = new Vector(x1, y1, z1)

        const x2 = parseFloat(item[4])
        const y2 = parseFloat(item[5])
        const z2 = parseFloat(item[6])

        const secondPoint = new Vector(x2, y2, z2)

        const x3 = parseFloat(item[7])
        const y3 = parseFloat(item[8])
        const z3 = parseFloat(item[9])

        const thirdPoint = new Vector(x3, y3, z3)

        model.addTriangle(new Triangle(color, firstPoint, secondPoint, thirdPoint))
    }

    private parseQuadrilateral(model: Model, data: string) {
        const item = data.substring('4 '.length).split(' ')

        const color = parseInt(item[0])

        const x1 = parseFloat(item[1])
        const y1 = parseFloat(item[2])
        const z1 = parseFloat(item[3])

        const firstPoint = new Vector(x1, y1, z1)

        const x2 = parseFloat(item[4])
        const y2 = parseFloat(item[5])
        const z2 = parseFloat(item[6])

        const secondPoint = new Vector(x2, y2, z2)

        const x3 = parseFloat(item[7])
        const y3 = parseFloat(item[8])
        const z3 = parseFloat(item[9])

        const thirdPoint = new Vector(x3, y3, z3)

        const x4 = parseFloat(item[10])
        const y4 = parseFloat(item[11])
        const z4 = parseFloat(item[12])

        const fourthPoint = new Vector(x4, y4, z4)

        model.addQuadliteral(new Quadrilateral(color, firstPoint, secondPoint, thirdPoint, fourthPoint))
    }

    private parseOptionalLine(model: Model, data: string) {
        const item = data.substring('4 '.length).split(' ')

        const color = parseInt(item[0])

        const x1 = parseFloat(item[1])
        const y1 = parseFloat(item[2])
        const z1 = parseFloat(item[3])

        const firstPoint = new Vector(x1, y1, z1)

        const x2 = parseFloat(item[4])
        const y2 = parseFloat(item[5])
        const z2 = parseFloat(item[6])

        const secondPoint = new Vector(x2, y2, z2)

        const x3 = parseFloat(item[7])
        const y3 = parseFloat(item[8])
        const z3 = parseFloat(item[9])

        const firstControlPoint = new Vector(x3, y3, z3)

        const x4 = parseFloat(item[10])
        const y4 = parseFloat(item[11])
        const z4 = parseFloat(item[12])

        const secondControlPoint = new Vector(x4, y4, z4)

        model.addOptionalLine(new OptionalLine(color, firstPoint, secondPoint, firstControlPoint, secondControlPoint))
    }

}