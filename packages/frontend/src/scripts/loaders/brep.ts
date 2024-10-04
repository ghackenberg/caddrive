import { Matrix4 } from 'three'

enum Section {
    None, Locations, Curve2ds, Curves, Polygon3D, PolygonOnTriangulations, Surfaces, Triangulations, TShapes
}

export function parseBRep(data: string) {
    let line: string
    let offset = 0
    
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

    while (offset < data.length) {
        ({ line, offset } = advance(data, offset))
        
        if (line.startsWith('Locations')) {
            section = Section.Locations
            nLocations = Number.parseInt(line.substring('Locations '.length))
        } else if (line.startsWith('Curve2ds')) {
            section = Section.Curve2ds
            nCurve2ds = Number.parseInt(line.substring('Curve2ds '.length))
        } else if (line.startsWith('Curves')) {
            section = Section.Curves
            nCurves = Number.parseInt(line.substring('Curves '.length))
        } else if (line.startsWith('Polygon3D')) {
            section = Section.Polygon3D
            nPolygon3D = Number.parseInt(line.substring('Polygon3D '.length))
        } else if (line.startsWith('PolygonOnTriangulations')) {
            section = Section.PolygonOnTriangulations
            nPolygonOnTriangulations = Number.parseInt(line.substring('PolygonOnTriangulations '.length))
        } else if (line.startsWith('Surfaces')) {
            section = Section.Surfaces
            nSurfaces = Number.parseInt(line.substring('Surfaces '.length))
        } else if (line.startsWith('Triangulations')) {
            section = Section.Triangulations
            nTriangulations = Number.parseInt(line.substring('Triangulations '.length))
        } else if (line.startsWith('TShapes')) {
            section = Section.TShapes
            nTShapes = Number.parseInt(line.substring('TShapes '.length))
        } else if (section == Section.Locations) {
            if (line.startsWith('1')) {
                // Parse location type 1

                ({ line, offset } = advance(data, offset))
                const row1 = line.trim().split(' ').map(part => Number.parseFloat(part));
                
                ({ line, offset } = advance(data, offset))
                const row2 = line.trim().split(' ').map(part => Number.parseFloat(part));

                ({ line, offset } = advance(data, offset))
                const row3 = line.trim().split(' ').map(part => Number.parseFloat(part));

                const location = new Matrix4()

                location.elements = [...row1, ...row2, ...row3, 0, 0, 0, 1]

                locations.push(location)
            } else if (line.startsWith('2')) {
                // Parse location type 2

                const row = line.substring('2 '.length).trim().split(' ').map(part => Number.parseInt(part))

                const location = new Matrix4()

                location.identity()

                for (let i = 0; i < row.length - 1; i += 2) {
                    const other = locations[row[i] - 1]
                    const power = row[i + 1]

                    if (power == -1) {
                        location.multiply(other.clone().invert())
                    } else if (power == 1) {
                        location.multiply(other)
                    } else {
                        throw 'Exponent not supported!'
                    }
                }

                locations.push(location)
            } else {
                throw 'Location type not supported!'
            }
        } else if (section == Section.Curve2ds) {
            // TODO
        } else if (section == Section.Curves) {
            if (line.startsWith('1')) {
                // TODO Parse line
            } else if (line.startsWith('2')) {
                // TODO Parse circle
            } else if (line.startsWith('3')) {
                // TODO Parse ellipse
            } else if (line.startsWith('4')) {
                // TODO Parse parabola
            } else if (line.startsWith('5')) {
                // TODO Parse hyperbola
            } else if (line.startsWith('6')) {
                // TODO Parse Bezier curve
            } else if (line.startsWith('7')) {
                // TODO Parse B-Spline curve
            } else if (line.startsWith('8')) {
                // TODO Parse trimmed curve
            } else if (line.startsWith('9')) {
                // TODO Parse offset curve
            } else {
                throw 'Curve type not supported!'
            }
        } else if (section == Section.Polygon3D) {
            // TODO
        } else if (section == Section.PolygonOnTriangulations) {
            // TODO
        } else if (section == Section.Surfaces) {
            // TODO
        } else if (section == Section.Triangulations) {
            // TODO
        } else if (section == Section.TShapes) {
            if (line.startsWith('Ve')) {
                // TODO
            } else if (line.startsWith('Ed')) {
                // TODO
            } else if (line.startsWith('Wi')) {
                // TODO
            } else if (line.startsWith('Fa')) {
                // TODO
            } else if (line.startsWith('Sh')) {
                // TODO
            } else if (line.startsWith('So')) {
                // TODO
            } else if (line.startsWith('CS')) {
                // TODO
            } else if (line.startsWith('Co')) {
                // TODO
            } else {
                // TODO throw 'Shape type not supported!'
            }
        }
    }

    console.log(nLocations, nCurve2ds, nCurves, nPolygon3D, nPolygonOnTriangulations, nSurfaces, nTriangulations, nTShapes)
}

function advance(data: string, offset: number) {
    const next = data.indexOf('\n', offset)
    const line = next != -1 ? data.substring(offset, next) : data.substring(offset)
    
    return { line, offset: offset + line.length + 1 }
}