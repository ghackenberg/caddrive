import { BufferGeometry, Color, DoubleSide, Group, Line, LineBasicMaterial, Matrix4, Mesh, MeshBasicMaterial, Vector3 } from 'three'

// Curve2D

export abstract class BRepCurve2D {

}
export class BRepLine2D extends BRepCurve2D {
    constructor(public p: number[], public d: number[]) {
        super()
    }
}
export class BRepCircle2D extends BRepCurve2D {
    constructor(public p: number[], public dX: number[], public dY: number[], public r: number) {
        super()
    }
}
export class BRepBSlineCurve2D extends BRepCurve2D {
    constructor(public degree: number, public poles: { b: number[], h: number | void }[], public knots: { u: number, q: number }[]) {
        super()
    }
}
export class BRepTrimmedCurve2D extends BRepCurve2D {
    constructor(public uMin: number, public uMax: number, public curve: BRepCurve2D) {
        super()
    }
}

// Curve

export abstract class BRepCurve {

}
export class BRepLine extends BRepCurve {
    constructor(public p: number[], public d: number[]) {
        super()
    }
}
export class BRepCircle extends BRepCurve {
    constructor(public p: number[], public dN: number[], public dX: number[], public dY: number[], public r: number) {
        super()
    }
}
export class BRepEllipse extends BRepCurve {
    constructor(public p: number[], public n: number[], public dMaj: number[], public dMin: number[], public rMaj: number, public rMin: number) {
        super()
    }
}
export class BRepBezierCurve extends BRepCurve {
    constructor(public rational: boolean, public degrees: number, public poles: { b: number[], h: number | void }[]) {
        super()
    }
}
export class BRepBSplineCurve extends BRepCurve {
    constructor(public rational: boolean, public degrees: number, public poles: { b: number[], h: number | void }[], public knots: { u: number, q: number }[]) {
        super()
    }
}
export class BRepTrimmedCurve extends BRepCurve {
    constructor(public uMin: number, public uMax: number, public curve: BRepCurve) {
        super()
    }
}

// Surface

export abstract class BRepSurface {

}
export class BRepPlane extends BRepSurface {
    constructor(public p: number[], public dN: number[], public dU: number[], public dV: number[]) {
        super()
    }
}
export class BRepCylinder extends BRepSurface {
    constructor(public p: number[], public dZ: number[], public dU: number[], public dV: number[], public r: number) {
        super()
    }
}
export class BRepCone extends BRepSurface {
    constructor(public p: number[], public dZ: number[], public dU: number[], public dV: number[], public r: number, public phi: number) {
        super()
    }
}
export class BRepSphere extends BRepSurface {
    constructor(public p: number[], public dZ: number[], public dU: number[], public dV: number[], public r: number) {
        super()
    }
}
export class BRepExtrusion extends BRepSurface {
    constructor(public d: number[], public curve: BRepCurve) {
        super()
    }
}
export class BRepRevolution extends BRepSurface {
    constructor(public p: number[], public d: number[], public curve: BRepCurve) {
        super()
    }
}
export class BRepBSplineSurface extends BRepSurface {
    constructor(public uRational: number, public vRational: number, public uDegree: number, public vDegree: number, public weightPoles: { b: number[], h: number | void }[][], public uKnots: { u: number, q: number }[], public vKnots: { u: number, q: number }[]) {
        super()
    }
}
export class BRepTrimmedSurface extends BRepSurface {
    constructor(public uMin: number, public uMax: number, public vMin: number, public vMax: number, public surface: BRepSurface) {
        super()
    }
}

// TShape

export interface BRepSubShape {
    orientation: string
    tshape: BRepTShape
    location: Matrix4
}

export abstract class BRepTShape {
    constructor(public flags: string, public subShapes: BRepSubShape[]) {

    }
}
export class BRepVertex extends BRepTShape {
    constructor(public tolerance: number, public point: number[], flags: string, subShapes: BRepSubShape[]) {
        super(flags, subShapes)
    }
}
export class BRepEdge extends BRepTShape {
    constructor(public tolerance: number, public parameter: boolean, public range: boolean, public degenerated: boolean, public edgeData: BRepEdgeData[], flags: string, subShapes: BRepSubShape[]) {
        super(flags, subShapes)
    }
}
export class BRepWire extends BRepTShape {
    constructor(flags: string, subShapes: BRepSubShape[]) {
        super(flags, subShapes)
    }
}
export class BRepFace extends BRepTShape {
    constructor(public natural: boolean, public tolerance: number, public surface: BRepSurface, public location: Matrix4, flags: string, subShapes: BRepSubShape[]) {
        super(flags, subShapes)
    }
}
export class BRepShell extends BRepTShape {
    constructor(flags: string, subShapes: BRepSubShape[]) {
        super(flags, subShapes)
    }
}
export class BRepSolid extends BRepTShape {
    constructor(flags: string, subShapes: BRepSubShape[]) {
        super(flags, subShapes)
    }
}
export class BRepCompound extends BRepTShape {
    constructor(flags: string, subShapes: BRepSubShape[]) {
        super(flags, subShapes)
    }
}

// Edge data

export abstract class BRepEdgeData {

}
export class BRepEdgeDataCurve3D extends BRepEdgeData {
    constructor(public curve: BRepCurve, public location: Matrix4, public min: number, public max: number) {
        super()
    }
}
export class BRepEdgeDataCurve2DSurface extends BRepEdgeData {
    constructor(public curve: BRepCurve2D, public surface: BRepSurface, public location: Matrix4, public min: number, public max: number) {
        super()
    }
}
export class BRepEdgeDataCurve2DClosedSurface extends BRepEdgeData {
    constructor(public curve: BRepCurve2D, public continuity: string, public surface: BRepSurface, public location: Matrix4, public min: number, public max: number) {
        super()
    }
}
export class BRepEdgeData4 extends BRepEdgeData {
    constructor(public continuity: string, public surface1: BRepSurface, public location1: Matrix4, public surface2: BRepSurface, public location2: Matrix4) {
        super()
    }
}

// BRep

export class BRep {
    locations: Matrix4[] = []
    curve2ds: BRepCurve2D[] = []
    curves: BRepCurve[] = []
    surfaces: BRepSurface[] = []
    tshapes: BRepTShape[] = []
}

// Convert

export function convertBRep(brep: BRep) {
    const tshape = brep.tshapes[brep.tshapes.length - 1]
    return convertBRepTShape(tshape)
}
function convertBRepTShape(tshape: BRepTShape) {
    if (tshape instanceof BRepWire) {
        return convertBRepWire(tshape)
    } else if (tshape instanceof BRepFace) {
        return convertBRepFace(tshape)
    } else if (tshape instanceof BRepSolid) {
        return convertBRepSolid(tshape)
    } else if (tshape instanceof BRepShell) {
        return convertBRepShell(tshape)
    } else if (tshape instanceof BRepCompound) {
        return convertBRepCompound(tshape)
    } else {
        console.log(tshape)
        throw 'TShape type not supported'
    }
}
function convertBRepWire(wire: BRepWire) {
    console.log(wire)

    const points: Vector3[] = []
    for (const subShape of wire.subShapes) {
        const edge = subShape.tshape
        const orientation = subShape.orientation

        if (edge instanceof BRepEdge) {
            if (edge.subShapes.length != 2) {
                console.log(edge)
                throw 'Two subshapes expected'
            }

            if (!(edge.subShapes[0].tshape instanceof BRepVertex)) {
                console.log(edge)
                throw 'BRepVertex expected'
            }
            if (!(edge.subShapes[1].tshape instanceof BRepVertex)) {
                console.log(edge)
                throw 'BRepVertex expected'
            }
            
            const vertex1 = edge.subShapes[0].tshape as BRepVertex
            const location1 = edge.subShapes[0].location || new Matrix4()
            const orientation1 = edge.subShapes[0].orientation
            const vector1 = new Vector3(vertex1.point[0], vertex1.point[1], vertex1.point[2]).applyMatrix4(location1)

            const vertex2 = edge.subShapes[1].tshape as BRepVertex
            const location2 = edge.subShapes[1].location || new Matrix4()
            const orientation2 = edge.subShapes[1].orientation
            const vector2 = new Vector3(vertex2.point[0], vertex2.point[1], vertex2.point[2]).applyMatrix4(location2)

            console.log(`${orientation} ${orientation1} [${vector1.x},${vector1.y},${vector1.z}] ${orientation2} [${vector2.x},${vector2.y},${vector2.z}]`)
            
            if (orientation == '+') {
                if (orientation1 == '+') {
                    points.length % 3 == 0 && points.push(vector2)
                    points.push(vector1)
                } else {
                    points.length % 3 == 0 && points.push(vector1)
                    points.push(vector2)
                }
            } else if (orientation == '-') {
                if (orientation1 == '-') {
                    points.length % 3 == 0 && points.push(vector2)
                    points.push(vector1)
                } else {
                    points.length % 3 == 0 && points.push(vector1)
                    points.push(vector2)
                }
            } else {
                throw 'Orientation unknown'
            }
        } else {
            throw 'TShape type not supported'
        }
    }

    console.log(points)

    const geometry = new BufferGeometry()
    geometry.setFromPoints(points)

    const lineMat = new LineBasicMaterial({ color: 'black' })

    const line = new Line(geometry, lineMat)
    line.name = 'BRepWire'

    const meshMat = new MeshBasicMaterial({ color: new Color(Math.random(), Math.random(), Math.random()), side: DoubleSide })

    const mesh = new Mesh(geometry, meshMat)
    mesh.name = 'BRepWire'

    const group = new Group()
    group.add(line, mesh)

    return group
}
function convertBRepFace(face: BRepFace) {
    const group = new Group()
    group.name = 'BRepFace'
    for (const subShape of face.subShapes) {
        const tshape = subShape.tshape
        const location = subShape.location
        const object = convertBRepTShape(tshape)
        location && object.matrix.copy(location)
        group.add(object)
    }
    return group
}
function convertBRepSolid(solid: BRepSolid) {
    const group = new Group()
    group.name = 'BRepSolid'
    for (const subShape of solid.subShapes) {
        const tshape = subShape.tshape
        const location = subShape.location
        const object = convertBRepTShape(tshape)
        location && object.matrix.copy(location)
        group.add(object)
    }
    return group
}
function convertBRepShell(shell: BRepShell) {
    const group = new Group()
    group.name = 'BRepShell'
    for (const subShape of shell.subShapes) {
        const tshape = subShape.tshape
        const location = subShape.location
        const object = convertBRepTShape(tshape)
        location && object.matrix.copy(location)
        group.add(object)
    }
    return group
}
function convertBRepCompound(compound: BRepCompound) {
    const group = new Group()
    group.name = 'BRepCompound'
    for (const subShape of compound.subShapes) {
        const tshape = subShape.tshape
        const location = subShape.location
        const object = convertBRepTShape(tshape)
        location && object.matrix.copy(location)
        group.add(object)
    }
    return group
}

// Parse

export function parseBRep(data: string) {

    let offset = 0

    enum BRepSection {
        None, Locations, Curve2ds, Curves, Polygon3D, PolygonOnTriangulations, Surfaces, Triangulations, TShapes
    }

    function token(log = false) {
        if (data[offset] == '\n') {
            log && console.log(offset, '\n')
            offset++
            return '\n'
        } else {
            let next = offset
            while (next < data.length) {
                if (data[next] == ' ') {
                    const token = data.substring(offset, next)
                    log && console.log(offset, next, token)
                    offset = next + 1
                    return token
                } else if (data[next] == '\n') {
                    const token = data.substring(offset, next)
                    log && console.log(offset, next, token)
                    offset = next
                    return token
                } else {
                    next++
                }
            }
            const token = data.substring(offset)
            log && console.log(offset, next, token)
            offset = next
            return token
        }
    }

    function empty(log = false) {
        const temp = token(log)
        if (temp != '') {
            throw 'Empty expected: ' + temp
        }
    }

    function newline(log = false) {
        const temp = token(log)
        if (temp != '\n') {
            throw 'Newline expected: ' + temp
        }
    }   

    /*
    function plusone(log = false) {
        const temp = token(log)
        if (temp != '+1') {
            throw 'Plusone expected: ' + temp
        }
    }

    function one(log = false) {
        const temp = token(log)
        if (temp != '1') {
            throw 'One expected: ' + temp
        }
    }
    */

    function flag(log = false) {
        const temp = token(log)
        if (temp == '0') {
            return false
        } else if (temp == '1') {
            return true
        } else {
            throw 'Flag expected: ' + temp
        }
    }

    function zero(log = false) {
        const temp = token(log)
        if (temp != '0') {
            throw 'Zero expected: ' + temp
        }
    }

    function int(log = false) {
        const temp = token(log)
        if (/[+-]?[0-9]+/.test(temp)) {
            return Number.parseInt(temp)
        } else {
            throw 'Int expected: ' + temp
        }
    }

    function real(log = false) {
        const temp = token(log)
        if (/[+-]?[0-9]+\.[0-9]+/.test(temp)) {
            return Number.parseFloat(temp)
        } else {
            throw 'Real expected: ' + temp
        }
    }

    function vector2(log = false) {
        return [real(log), real(log)]
    }

    function vector3(log = false) {
        return [real(log), real(log), real(log)]
    }

    function vector4(log = false) {
        return [real(log), real(log), real(log), real(log)]
    }

    function location(type: string): Matrix4 {
        if (type == '1') {
            // Parse location type 1

            newline()
            const row1 = vector4()
            newline()
            const row2 = vector4()
            newline()
            const row3 = vector4()
            newline()

            const location = new Matrix4()
            location.elements = [...row1, ...row2, ...row3, 0, 0, 0, 1]
            
            return location
        } else if (type == '2') {
            // Parse location type 2

            const location = new Matrix4()
            location.identity()

            empty()

            let index: number

            while ((index = int()) != 0) {
                const other = locations[index - 1]
                const power = int()
                if (power == -1) {
                    location.multiply(other.clone().invert())
                } else if (power == 1) {
                    location.multiply(other)
                } else {
                    throw 'Exponent not supported: ' + power
                }
            }
            
            newline()

            return location
        } else {
            throw 'Location type not supported: ' + type
        }
    }

    function curve2d(type: string, log = false): BRepCurve2D {
        if (type == '1') {
            const p = vector2()
            const d = vector2()
            newline()
            log && console.log('line', p, d)
            return new BRepLine2D(p, d)
        } else if (type == '2') {
            const c = vector2()
            const dx = vector2()
            const dy = vector2()
            const r = real()
            newline()
            log && console.log('circle', c, dx, dy, r)
            return new BRepCircle2D(c, dx, dy, r)
        } else if (type == '7') {
            const rational = flag()
            flag()
            empty()
            const degree = int()
            const poleCount = int()
            const knotCount = int()

            const poles: { b: number[], h: number | void }[] = []
            while (poles.length < poleCount) {
                empty()
                const b = vector2()
                const h = rational && real()

                poles.push({ b, h })
            }

            newline()
            empty()

            const knots: { u: number, q: number }[] = []
            while (knots.length < knotCount) {
                const u = real()
                const q = int()

                knots.push({ u, q })
            }
            
            newline()
            log && console.log('b-sline', degree, poleCount, knotCount, poles, knots)
            return new BRepBSlineCurve2D(degree, poles, knots)
        } else if (type == '8') {
            const umin = real()
            const umax = real()
            newline()
            const child = curve2d(token())
            log && console.log(umin, umax)
            return new BRepTrimmedCurve2D(umin, umax, child)
        } else {
            throw 'Curve2d type not supported: ' + type
        }
    }

    function curve(type: string, log = false): BRepCurve {
        if (type == '1') {
            const p = vector3()
            const d = vector3()
            newline()
            log && console.log('line', p, d)
            return new BRepLine(p, d)
        } else if (type == '2') {
            const c = vector3()
            const dN = vector3()
            const dX = vector3()
            const dY = vector3()
            const r = real()
            newline()
            log && console.log('circle', c, dN, dX, dY, r)
            return new BRepCircle(c, dN, dX, dY, r)
        } else if (type == '3') {
            const c = vector3()
            const n = vector3()
            const dMaj = vector3()
            const dMin = vector3()
            const rMaj = real()
            const rMin = real()
            newline()
            log && console.log('ellipse', c, n, dMaj, dMin, rMaj, rMin)
            return new BRepEllipse(c, n, dMaj, dMin, rMaj, rMin)
        } else if (type == '6') {
            const rational = flag()
            const degree = int()

            const poles: { b: number[], h: number | void }[] = []
            while (poles.length < degree + 1) {
                const b = vector3()
                const h = rational ? real() : empty()

                poles.push({ b, h })
            }

            newline()
            log && console.log('bezier', rational, degree, poles)
            return new BRepBezierCurve(rational, degree, poles)
        } else if (type == '7') {
            const rational = flag()
            flag()
            empty()
            const degree = int()
            const poleCount = int()
            const knotCount = int()

            const poles: { b: number[], h: number | void }[] = []
            while (poles.length < poleCount) {
                empty()
                const b = vector3()
                const h = rational && real()

                poles.push({ b, h })
            }

            newline()
            empty()

            const knots: { u: number, q: number }[] = []
            while (knots.length < knotCount) {
                const u = real()
                const q = int()

                knots.push({ u, q })
            }

            newline()
            log && console.log('b-spline', rational, degree, poleCount, knotCount, poles, knots)
            return new BRepBSplineCurve(rational, degree, poles, knots)
        } else if (type == '8') {
            const umin = real()
            const umax = real()
            newline()
            const child = curve(token())
            log && console.log('trimmed curve', umin, umax)
            return new BRepTrimmedCurve(umin, umax, child)
        } else {
            throw 'Curve type not supported: ' + type
        }
    }

    function surface(type: string, log = false): BRepSurface {
        if (type == '1') {
            const p = vector3()
            const dN = vector3()
            const dU = vector3()
            const dV = vector3()
            newline()
            log && console.log('plane', p, dN, dU, dV)
            return new BRepPlane(p, dN, dU, dV)
        } else if (type == '2') {
            const p = vector3()
            const dZ = vector3()
            const dX = vector3()
            const dY = vector3()
            const r = real()
            newline()
            log && console.log('cylinder', p, dZ, dX, dY, r)
            return new BRepCylinder(p, dZ, dX, dY, r)
        } else if (type == '3') {
            const p = vector3()
            const dZ = vector3()
            const dX = vector3()
            const dY = vector3()
            const r = real()
            newline()
            const phi = real()
            newline()
            log && console.log('cone', p, dZ, dX, dY, r, phi)
            return new BRepCone(p, dZ, dX, dY, r, phi)
        } else if (type == '4') {
            const p = vector3()
            const dZ = vector3()
            const dX = vector3()
            const dY = vector3()
            const r = real()
            newline()
            log && console.log('sphere', p, dZ, dX, dY, r)
            return new BRepSphere(p, dZ, dX, dY, r)
        } else if (type == '6') {
            const dV = vector3()
            newline()
            const c = curve(token())
            log && console.log('extrusion', dV)
            return new BRepExtrusion(dV, c)
        } else if (type == '7') {
            const p = vector3()
            const d = vector3()
            newline()
            const c = curve(token())
            log && console.log('revolution', p, d)
            return new BRepRevolution(p, d, c)
        } else if (type == '9') {
            const uRational = int()
            const vRational = int()
            zero()
            zero()
            const uDegree = int()
            const vDegree = int()
            const uPoleCount = int()
            const vPoleCount = int()
            const uKnotCount = int()
            const vKnotCount = int()
            log && console.log('b-spline', uRational, vRational, uDegree, vDegree, uPoleCount, vPoleCount, uKnotCount, vKnotCount)
            const weightPoles: { b: number[], h: number | void }[][] = []
            while (weightPoles.length < uPoleCount) {
                const weightPoleGroup: { b: number[], h: number | void }[] = []
                while (weightPoleGroup.length < vPoleCount) {
                    const b = vector3()
                    const h = (uRational + vRational) ? real() : empty()
                    weightPoleGroup.push({ b, h })
                }
                newline()
                weightPoles.push(weightPoleGroup)
            }
            log && console.log('b-spline', 'weightPoles', weightPoles)
            newline()
            const uKnots: { u: number, q: number }[] = []
            while (uKnots.length < uKnotCount) {
                const u = real()
                const q = int()
                newline()
                uKnots.push({ u, q })
            }
            newline()
            log && console.log('b-spline', 'uKnots', uKnots)
            const vKnots: { u: number, q: number }[] = []
            while (vKnots.length < vKnotCount) {
                const u = real()
                const q = int()
                newline()
                vKnots.push({ u, q })
            }
            newline()
            log && console.log('b-spline', 'vKnots', vKnots)
            return new BRepBSplineSurface(uRational, vRational, uDegree, vDegree, weightPoles, uKnots, vKnots)
        } else if (type == '10') {
            const uMin = real()
            const uMax = real()
            const vMin = real()
            const vMax = real()
            newline()
            const child = surface(token())
            log && console.log('trimmed surface', uMin, uMax, vMin, vMax, child)
            return new BRepTrimmedSurface(uMin, uMax, vMin, vMax, child)
        } else {
            throw 'Surface type not supported: ' + type
        }
    }

    function subshapes(log = false): BRepSubShape[] {
        const result: BRepSubShape[] = []

        let next: string

        do {
            next = token()
            if (next == '*') {
                // ignore
            } else if (next == '\n') {
                // ignore
            } else if (next.startsWith('+')) {
                const o = next.substring(0, 1)
                const iS = Number.parseInt(next.substring(1))
                const iL = int()

                result.push({ orientation: o, tshape: tshapes[nTShapes - iS], location: locations[iL - 1] })
            } else if (next.startsWith('-')) {
                const o = next.substring(0, 1)
                const iS = Number.parseInt(next.substring(1))
                const iL = int()

                result.push({ orientation: o, tshape: tshapes[nTShapes - iS], location: locations[iL - 1] })
            } else {
                throw 'Orientation expected: ' + next
            }
        } while (next != '*')

        log && console.log('subshapes', result)

        return result
    }

    function tshape(type: string, log = false): BRepTShape {
        if (type == 'Ve') {
            newline()
            const t = real()
            newline()
            const p = vector3()
            newline()
            // TODO Parse vertex representation data (if available)
            zero()
            zero()
            newline()
            newline()
            const flags = token()
            newline()
            const ss = subshapes()
            newline()
            log && console.log('vertex', t, p, flags, ss)
            return new BRepVertex(t, p, flags, ss)
        } else if (type == 'Ed') {
            newline()
            empty()
            const t = real()
            const p = flag()
            const r = flag()
            const d = flag()
            newline()

            const ed: BRepEdgeData[] = []

            let subtype: string

            do {
                subtype = token()

                if (subtype == '0') {
                    newline()
                } else if (subtype == '1') {
                    empty()
                    const iC = int()
                    const iL = int()
                    const min = real()
                    const max = real()
                    newline()
                    false && console.log('edge data curve3D', iC, iL, min, max)
                    ed.push(new BRepEdgeDataCurve3D(curves[iC - 1], locations[iL - 1], min, max))
                } else if (subtype == '2') {
                    empty()
                    const iC = int()
                    const iS = int()
                    const iL = int()
                    const min = real()
                    const max = real()
                    newline()
                    false && console.log('edge data curve2D on surface', iC, iS, iL, min, max)
                    ed.push(new BRepEdgeDataCurve2DSurface(curve2ds[iC - 1], surfaces[iS - 1], locations[iL - 1], min, max))
                } else if (subtype == '3') {
                    empty()
                    const iC = int()
                    const continuity = token()
                    const iS = int()
                    const iL = int()
                    const min = real()
                    const max = real()
                    newline()
                    false && console.log('edge data curve2D on closed surface', iC, continuity, iS, iL, min, max)
                    ed.push(new BRepEdgeDataCurve2DClosedSurface(curve2ds[iC - 1], continuity, surfaces[iS - 1], locations[iL - 1], min, max))
                } else if (subtype == '4') {
                    const continuity = token()
                    const iS1 = int()
                    const iL1 = int()
                    const iS2 = int()
                    const iL2 = int()
                    newline()
                    false && console.log('edge data 4', continuity, iS1, iL1, iS2, iL2)
                    ed.push(new BRepEdgeData4(continuity, surfaces[iS1 - 1], locations[iL1 - 1], surfaces[iS2 - 1], locations[iL2 - 1]))
                } else {
                    throw 'Edge data representation type not suppoted: ' + subtype
                }
            } while (subtype != '0') 

            newline()
            const f = token()
            newline()
            const s = subshapes()
            newline()
            log && console.log('edge', t, p, r, d, f, s)
            const edge = new BRepEdge(t, p, r, d, ed, f, s)
            log && console.log(edge)
            return edge
        } else if (type == 'Wi') {
            newline()
            newline()
            const f = token()
            newline()
            const s = subshapes()
            newline()
            log && console.log('wire', f, s)
            const wire = new BRepWire(f, s)
            log && console.log('\twire', wire.subShapes.length)
            for (const edge of wire.subShapes) {
                log && console.log('\t\tedge')
                if (edge.tshape instanceof BRepEdge) {
                    for (const vertex of edge.tshape.subShapes) {
                        if (vertex.tshape instanceof BRepVertex) {
                            log && console.log('\t\t\t', vertex.tshape.point)
                        } else {
                            throw 'Vertex expected ' + vertex.constructor.name
                        }
                    }
                } else {
                    throw 'Edge expected: ' + edge.constructor.name
                }
            }
            return wire
        } else if (type == 'Fa') {
            newline()
            const n = flag()
            empty()
            const t = real()
            const iS = int()
            const iL = int()
            newline()
            newline()
            const f = token()
            newline()
            const s = subshapes()
            newline()
            log && console.log('face', n, t, iS, iL, f, surfaces[iS - 1], s)
            return new BRepFace(n, t, surfaces[iS - 1], locations[iL - 1], f, s)
        } else if (type == 'Sh') {
            newline()
            newline()
            const f = token()
            newline()
            const s = subshapes()
            newline()
            log && console.log('shell', f, s)
            return new BRepShell(f, s)
        } else if (type == 'So') {
            newline()
            newline()
            const flags = token()
            newline()
            const sub = subshapes()
            newline()
            log && console.log('solid', flags, sub)
            const solid = new BRepSolid(flags, sub)
            log && console.log(solid)
            return solid
        } else if (type == 'Co') {
            newline()
            newline()
            const flags = token()
            newline()
            const ss = subshapes()
            newline()
            log && console.log('compound', flags, ss)
            return new BRepCompound(flags, ss)
        } else {
            throw 'TShape type not supported: ' + type
        }
    }
    
    let section = BRepSection.None

    let nLocations = 0
    let nCurve2ds = 0
    let nCurves = 0
    let nPolygon3D = 0
    let nPolygonOnTriangulations = 0
    let nSurfaces = 0
    let nTriangulations = 0
    let nTShapes = 0

    const brep = new BRep()

    const locations = brep.locations
    const curve2ds = brep.curve2ds
    const curves = brep.curves
    const surfaces = brep.surfaces
    const tshapes = brep.tshapes

    while (offset < data.length) {
        const next = token()
        if (next == 'Locations') {
            section = BRepSection.Locations
            nLocations = int()
            newline()
            false && console.log('Locations', nLocations)
        } else if (next == 'Curve2ds') {
            section = BRepSection.Curve2ds
            nCurve2ds = int()
            newline()
            false && console.log('Curve2ds', nCurve2ds)
        } else if (next == 'Curves') {
            section = BRepSection.Curves
            nCurves = int()
            newline()
            false && console.log('Curves', nCurves)
        } else if (next == 'Polygon3D') {
            section = BRepSection.Polygon3D
            nPolygon3D = int()
            newline()
            nPolygon3D > 0 && console.log('Polygon3D', nPolygon3D)
        } else if (next == 'PolygonOnTriangulations') {
            section = BRepSection.PolygonOnTriangulations
            nPolygonOnTriangulations = int()
            newline()
            nPolygonOnTriangulations > 0 && console.log('PolygonOnTriangulation', nPolygonOnTriangulations)
        } else if (next == 'Surfaces') {
            section = BRepSection.Surfaces
            nSurfaces = int()
            newline()
            false && console.log('Surfaces', nSurfaces)
        } else if (next == 'Triangulations') {
            section = BRepSection.Triangulations
            nTriangulations = int()
            newline()
            nTriangulations > 0 && console.log('Triangulations', nTriangulations)
        } else if (next == 'TShapes') {
            section = BRepSection.TShapes
            nTShapes = int()
            newline()
            false && console.log('TShapes', nTShapes)
        } else if (section == BRepSection.Locations) {
            locations.push(location(next))
        } else if (section == BRepSection.Curve2ds) {
            curve2ds.push(curve2d(next))
        } else if (section == BRepSection.Curves) {
            curves.push(curve(next))
        } else if (section == BRepSection.Polygon3D) {
            // TODO
        } else if (section == BRepSection.PolygonOnTriangulations) {
            // TODO
        } else if (section == BRepSection.Surfaces) {
            surfaces.push(surface(next))
        } else if (section == BRepSection.Triangulations) {
            // TODO
        } else if (section == BRepSection.TShapes) {
            if (next != '\n') {
                tshapes.push(tshape(next))
            } else {
                token()
                token()
            }
        }
    }

    return brep
}