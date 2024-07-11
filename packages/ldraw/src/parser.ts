import { Color, Command, Comment, Finish, FinishName, FinishType, Line, Matrix, Model, OptionalLine, Quadrilateral, Reference, Triangle, Vector } from "./model"

interface Context {
    root: Model
    current: Model
}

export class Parser {

    parse(text: string, url: string = undefined) {
        const model = new Model(url)

        this.extend(model, text)

        return model
    }

    extend(model: Model, text: string) {
        const context = { root: model, current: model }

        const lines = text.split('\n')
        for (const line of lines) {
            this.parseEntry(context, line.trim())
        }
    }

    private parseEntry(context: Context, data: string) {
        if (data.startsWith('0 ')) {
            if (data.startsWith('0 !')) {
                this.parseCommand(context, data)
            } else {
                this.parseComment(context, data)
            }
        } else if (data.startsWith('1 ')) {
            this.parseReference(context, data)
        } else if (data.startsWith('2 ')) {
            this.parseLine(context, data)
        } else if (data.startsWith('3 ')) {
            this.parseTriangle(context, data)
        } else if (data.startsWith('4 ')) {
            this.parseQuadrilateral(context, data)
        } else if (data.startsWith('5 ')) {
            this.parseOptionalLine(context, data)
        }
    }

    private parseCommand(context: Context, data: string) {
        context.current.addCommand(new Command(data, data.substring('0 !'.length)))
        if (data.startsWith('0 !DATA ')) {
            const name = data.substring('0 !DATA '.length)
            const model = new Model(name, context.root)
            context.root.addFile(model)
            context.current = model
        } else if (data.startsWith('0 !COLOUR ')) {
            const item = data.substring('0 !COLOUR '.length).replace(/  +/g, ' ').split(' ')
            const name = item[0]
            let code: number
            let value: string
            let edge: string
            let alpha: number
            let luminance: number
            let finishType: FinishType
            let finishName: FinishName
            let finishValue: string
            let finishAlpha: number
            let finishLuminance: number
            let finishFraction: number
            let finishVFraction: number
            let finishSize: number
            let finishMinSize: number
            let finishMaxSize: number
            for (let index = 1; index < item.length; index++) {
                if (item[index] == 'CODE') {
                    code = parseInt(item[index + 1])
                } else if (finishType === undefined && item[index] == 'VALUE') {
                    value = item[++index]
                } else if (item[index] == 'EDGE') {
                    edge = item[++index]
                } else if (finishType === undefined && item[index] == 'ALPHA') {
                    alpha = parseInt(item[++index])
                } else if (finishType === undefined && item[index] == 'LUMINANCE') {
                    luminance = parseInt(item[++index])
                } else if (item[index] == 'CHROME') {
                    finishType = FinishType.CHROME
                } else if (item[index] == 'PEARLESCENT') {
                    finishType = FinishType.PEARLESCENT
                } else if (item[index] == 'RUBBER') {
                    finishType = FinishType.RUBBER
                } else if (item[index] == 'MATTE_METALLIC') {
                    finishType = FinishType.MATTE_METALLIC
                } else if (item[index] == 'METAL') {
                    finishType = FinishType.METAL
                } else if (item[index] == 'MATERIAL') {
                    finishType = FinishType.MATERIAL
                } else if (finishType == FinishType.MATERIAL && item[index] == 'GLITTER') {
                    finishName = FinishName.GLITTER
                } else if (finishType == FinishType.MATERIAL && item[index] == 'SPECKLE') {
                    finishName = FinishName.SPECKLE
                } else if (finishType == FinishType.MATERIAL && item[index] == 'VALUE') {
                    finishValue = item[++index]
                } else if (finishType == FinishType.MATERIAL && item[index] == 'ALPHA') {
                    finishAlpha = parseInt(item[++index])
                } else if (finishType == FinishType.MATERIAL && item[index] == 'LUMINANCE') {
                    finishLuminance = parseInt(item[++index])
                } else if (finishType == FinishType.MATERIAL && item[index] == 'FRACTION') {
                    finishFraction = parseInt(item[++index])
                } else if (finishType == FinishType.MATERIAL && item[index] == 'VFRACTION') {
                    finishVFraction = parseInt(item[++index])
                } else if (finishType == FinishType.MATERIAL && item[index] == 'SIZE') {
                    finishSize = parseInt(item[++index])
                } else if (finishType == FinishType.MATERIAL && item[index] == 'MINSIZE') {
                    finishMinSize = parseInt(item[++index])
                } else if (finishType == FinishType.MATERIAL && item[index] == 'MAXSIZE') {
                    finishMaxSize = parseInt(item[++index])
                }
            }
            const finish = new Finish(finishType, finishName, finishValue, finishAlpha, finishLuminance, finishFraction, finishVFraction, finishSize, finishMinSize, finishMaxSize)
            const color = new Color(name, code, value, edge, alpha, luminance, finish)
            context.root.addColor(color)
        }
    }

    private parseComment(context: Context, data: string) {
        if (data.startsWith('0 FILE ')) {
            const name = data.substring('0 FILE '.length)
            const model = new Model(name, context.root)
            context.root.addFile(model)
            context.current = model
        } else if (data.startsWith('0 NOFILE')) {
            context.current = context.root
        } else if (data.startsWith('0 // ')) {
            context.current.addComment(new Comment(data, data.substring('0 // '.length)))
        } else if (data.startsWith('0 //')) {
            context.current.addComment(new Comment(data, data.substring('0 //'.length)))
        } else {
            context.current.addComment(new Comment(data, data.substring('0 '.length)))
        }
    }

    private parseReference(context: Context, data: string) {
        const item = data.replace(/  +/g, ' ').substring('1 '.length).split(' ')
        
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
        
        context.current.addReference(new Reference(data, color, position, orientation, file))
    }

    private parseLine(context: Context, data: string) {
        const item = data.replace(/  +/g, ' ').substring('2 '.length).split(' ')

        const color = parseInt(item[0])

        const x1 = parseFloat(item[1])
        const y1 = parseFloat(item[2])
        const z1 = parseFloat(item[3])

        const firstPoint = new Vector(x1, y1, z1)

        const x2 = parseFloat(item[4])
        const y2 = parseFloat(item[5])
        const z2 = parseFloat(item[6])

        const secondPoint = new Vector(x2, y2, z2)

        context.current.addLine(new Line(data, color, firstPoint, secondPoint))
    }

    private parseTriangle(context: Context, data: string) {
        const item = data.replace(/  +/g, ' ').substring('3 '.length).split(' ')

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

        context.current.addTriangle(new Triangle(data, color, firstPoint, secondPoint, thirdPoint))
    }

    private parseQuadrilateral(context: Context, data: string) {
        const item = data.replace(/  +/g, ' ').substring('4 '.length).split(' ')

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

        context.current.addQuadliteral(new Quadrilateral(data, color, firstPoint, secondPoint, thirdPoint, fourthPoint))
    }

    private parseOptionalLine(context: Context, data: string) {
        const item = data.replace(/  +/g, ' ').substring('5 '.length).split(' ')

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

        context.current.addOptionalLine(new OptionalLine(data, color, firstPoint, secondPoint, firstControlPoint, secondControlPoint))
    }

}