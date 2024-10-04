import { Matrix4 } from 'three'

enum Section {
    None, Locations, Curve2ds, Curves, Polygon3D, PolygonOnTriangulations, Surfaces, Triangulations, TShapes
}

export function parseBRep(data: string) {

    let offset = 0

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

    function location(type: string) {
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
            
            locations.push(location)
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

            locations.push(location)
        } else {
            throw 'Location type not supported: ' + type
        }
    }

    function curve2d(type: string, log = false) {
        if (type == '1') {
            const p = vector2()
            const d = vector2()
            newline()
            log && console.log('line', p, d)
        } else if (type == '2') {
            const c = vector2()
            const dx = vector2()
            const dy = vector2()
            const r = real()
            newline()
            log && console.log('circle', c, dx, dy, r)
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
        } else if (type == '8') {
            const umin = real()
            const umax = real()
            newline()
            curve2d(token())
            log && console.log(umin, umax)
        } else {
            throw 'Curve2d type not supported: ' + type
        }
    }

    function curve(type: string, log = false) {
        if (type == '1') {
            const point = vector3()
            const direction = vector3()
            newline()
            log && console.log('line', point, direction)
        } else if (type == '2') {
            const c = vector3()
            const dN = vector3()
            const dX = vector3()
            const dY = vector3()
            const r = real()
            newline()
            log && console.log('circle', c, dN, dX, dY, r)
        } else if (type == '3') {
            const c = vector3()
            const n = vector3()
            const dMaj = vector3()
            const dMin = vector3()
            const rMaj = real()
            const rMin = real()
            newline()
            log && console.log('ellipse', c, n, dMaj, dMin, rMaj, rMin)
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
        } else if (type == '8') {
            const umin = real()
            const umax = real()
            newline()
            curve(token())
            log && console.log('trimmed curve', umin, umax)
        } else {
            throw 'Curve type not supported: ' + type
        }
    }

    function surface(type: string, log = false) {
        if (type == '1') {
            const p = vector3()
            const dN = vector3()
            const dU = vector3()
            const dV = vector3()
            newline()
            log && console.log('plane', p, dN, dU, dV)
            surfaces.push('plane')
        } else if (type == '2') {
            const p = vector3()
            const dZ = vector3()
            const dX = vector3()
            const dY = vector3()
            const r = real()
            newline()
            log && console.log('cylinder', p, dZ, dX, dY, r)
            surfaces.push('cylinder')
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
            surfaces.push('cone')
        } else if (type == '4') {
            const p = vector3()
            const dZ = vector3()
            const dX = vector3()
            const dY = vector3()
            const r = real()
            newline()
            log && console.log('sphere', p, dZ, dX, dY, r)
            surfaces.push('sphere')
        } else if (type == '6') {
            const dV = vector3()
            newline()
            curve(token())
            log && console.log(dV)
        } else if (type == '7') {
            const p = vector3()
            const d = vector3()
            newline()
            curve(token())
            log && console.log('revolution', p, d)
            surfaces.push('revolution')
        } else {
            throw 'Surface type not supported: ' + type
        }
    }

    function subshapes(log = false) {
        const subshapes: { o: string, iS: number, iL: number }[] = []

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

                subshapes.push({ o, iS, iL })
            } else if (next.startsWith('-')) {
                const o = next.substring(0, 1)
                const iS = Number.parseInt(next.substring(1))
                const iL = int()

                subshapes.push({ o, iS, iL })
            } else {
                throw 'Orientation expected: ' + next
            }
        } while (next != '*')

        log && console.log('subshapes', subshapes)

        return subshapes
    }

    function tshape(type: string, log = false) {
        if (type == 'Ve') {
            newline()
            const tolerance = real()
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
            subshapes()
            newline()
            log && console.log('vertex', tolerance, p, flags)
        } else if (type == 'Ed') {
            newline()
            empty()
            const tolerance = real()
            const parameter = flag()
            const range = flag()
            const degenerated = flag()
            newline()

            let subtype: string

            do {
                subtype = token()

                if (subtype == '0') {
                    newline()
                } else if (subtype == '1') {
                    empty()
                    const iCurve = int()
                    const iLocation = int()
                    const min = real()
                    const max = real()
                    newline()
                    log && console.log('edge data curve3D', iCurve, iLocation, min, max)
                } else if (subtype == '2') {
                    empty()
                    const iCurve = int()
                    const iSurface = int()
                    const iLocation = int()
                    const min = real()
                    const max = real()
                    newline()
                    log && console.log('edge data curve2D on surface', iCurve, iSurface, iLocation, min, max)
                } else if (subtype == '3') {
                    empty()
                    const iCurve = int()
                    const continuity = token()
                    const iSurface = int()
                    const iLocation = int()
                    const min = real()
                    const max = real()
                    newline()
                    log && console.log('edge data curve2D on closed surface', iCurve, continuity, iSurface, iLocation, min, max)
                } else if (subtype == '4') {
                    const continuity = token()
                    const iSurface1 = int()
                    const iLocation1 = int()
                    const iSurface2 = int()
                    const iLocation2 = int()
                    newline()
                    log && console.log('edge data 4', continuity, iSurface1, iLocation1, iSurface2, iLocation2)
                } else {
                    throw 'Edge data representation type not suppoted: ' + subtype
                }
            } while (subtype != '0') 

            newline()
            const flags = token()
            newline()
            subshapes()
            newline()
            log && console.log('edge', tolerance, parameter, range, degenerated, flags)
        } else if (type == 'Wi') {
            newline()
            newline()
            const flags = token()
            newline()
            subshapes()
            newline()
            log && console.log('wire', flags)
        } else if (type == 'Fa') {
            newline()
            const natural = flag()
            empty()
            const tolerance = real()
            const iSurface = int()
            const iLocation = int()
            newline()
            newline()
            const flags = token()
            newline()
            const ss = subshapes()
            newline()
            true && console.log('face', natural, tolerance, iSurface, iLocation, flags, surfaces[iSurface - 1], ss)
        } else if (type == 'Sh') {
            newline()
            newline()
            const flags = token()
            newline()
            subshapes()
            newline()
            log && console.log('shell', flags)
        } else if (type == 'So') {
            newline()
            newline()
            const flags = token()
            newline()
            subshapes()
            newline()
            log && console.log('solid', flags)
        } else if (type == 'Co') {
            newline()
            newline()
            const flags = token()
            newline()
            subshapes()
            newline()
            log && console.log('compound', flags)
        } else if (type == '\n') {
            token()
            token()
            log && console.log('end')
        } else {
            throw 'TShape type not supported: ' + type
        }
    }
    
    let section = Section.None

    let nLocations = 0
    let nCurve2ds = 0
    let nCurves = 0
    let nPolygon3D = 0
    let nPolygonOnTriangulations = 0
    let nSurfaces = 0
    let nTriangulations = 0
    let nTShapes = 0

    const locations: Matrix4[] = []
    const surfaces: string[] = []

    while (offset < data.length) {
        const next = token()
        if (next == 'Locations') {
            section = Section.Locations
            nLocations = int()
            newline()
            false && console.log('Locations', nLocations)
        } else if (next == 'Curve2ds') {
            section = Section.Curve2ds
            nCurve2ds = int()
            newline()
            false && console.log('Curve2ds', nCurve2ds)
        } else if (next == 'Curves') {
            section = Section.Curves
            nCurves = int()
            newline()
            false && console.log('Curves', nCurves)
        } else if (next == 'Polygon3D') {
            section = Section.Polygon3D
            nPolygon3D = int()
            newline()
            nPolygon3D > 0 && console.log('Polygon3D', nPolygon3D)
        } else if (next == 'PolygonOnTriangulations') {
            section = Section.PolygonOnTriangulations
            nPolygonOnTriangulations = int()
            newline()
            nPolygonOnTriangulations > 0 && console.log('PolygonOnTriangulation', nPolygonOnTriangulations)
        } else if (next == 'Surfaces') {
            section = Section.Surfaces
            nSurfaces = int()
            newline()
            false && console.log('Surfaces', nSurfaces)
        } else if (next == 'Triangulations') {
            section = Section.Triangulations
            nTriangulations = int()
            newline()
            nTriangulations > 0 && console.log('Triangulations', nTriangulations)
        } else if (next == 'TShapes') {
            section = Section.TShapes
            nTShapes = int()
            newline()
            nTShapes == 0 && console.log('TShapes', nTShapes)
        } else if (section == Section.Locations) {
            location(next)
        } else if (section == Section.Curve2ds) {
            curve2d(next)
        } else if (section == Section.Curves) {
            curve(next)
        } else if (section == Section.Polygon3D) {
            // TODO
        } else if (section == Section.PolygonOnTriangulations) {
            // TODO
        } else if (section == Section.Surfaces) {
            surface(next)
        } else if (section == Section.Triangulations) {
            // TODO
        } else if (section == Section.TShapes) {
            tshape(next)
        }
    }
}