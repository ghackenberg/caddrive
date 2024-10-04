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
                // Parse vertex
                ({line, offset} = advance(data, offset))
                const tolerance = Number.parseFloat(line.trim());
                ({line, offset} = advance(data, offset))
                const coordinates = line.trim().split(' ').map(part => Number.parseFloat(part));
                ({line, offset} = advance(data, offset))
                if (!line.startsWith('0 0')) {
                    throw 'Vertex: End delimiter expected!'
                }
                ({line, offset} = advance(data, offset))
                if (line.trim().length > 0) {
                    throw 'Vertex: Empty line expected!'
                }
                ({line, offset} = advance(data, offset))
                const flags = line;
                if (line.trim().length != 7) {
                    throw 'Vertex: Seven chars expected!'
                }
                ({line, offset} = advance(data, offset))
                const more = line;
                if (!line.trim().endsWith('*')) {
                    throw 'Vertex: Star symbol expected!'
                }
                console.log('vertex', tolerance, coordinates, flags, more)
            } else if (line.startsWith('Ed')) {
                // Parse edge
                ({line, offset} = advance(data, offset))
                const tolerance = line;
                const edges = []
                do {
                    ({line, offset} = advance(data, offset))
                    if (line.startsWith('0')) {
                        // Ignore
                    } else if (line.startsWith('1')) {
                        // TODO Parse 3D curve
                        edges.push('3D curve')
                    } else if (line.startsWith('2')) {
                        // TODO Parse 2D curve on surface
                        edges.push('2D curve on surface')
                    } else if (line.startsWith('3')) {
                        // TODO Parse 2D curve on closed surface
                        edges.push('2D curve on closed surface')
                    } else if (line.startsWith('4')) {
                        // TODO Parse ?
                        edges.push('?')
                    } else if (line.startsWith('5')) {
                        // TODO Parse 3D polyline
                        edges.push('3D polyline')
                    } else if (line.startsWith('6')) {
                        // TODO Parse polyline on triangulation
                        edges.push('polyline on triangulation')
                    } else if (line.startsWith('7')) {
                        // TODO Parse ?
                        edges.push('?')
                    } else {
                        throw 'Edge type not supported!'
                    }
                } while (!line.startsWith('0'))
                ({line, offset} = advance(data, offset))
                if (line.trim().length != 0) {
                    throw 'Edge: Empty line expected!'
                }
                ({line, offset} = advance(data, offset))
                const flags = line;
                if (line.trim().length != 7) {
                    throw 'Edge: Seven chars expected!'
                }
                ({line, offset} = advance(data, offset))
                const more = line;
                if (!line.trim().endsWith('*')) {
                    throw 'Edge: Star symbol expected!'
                } else if (line.trim().split(' ').length != 5) {
                    throw 'Edge: Four numbers expected!'
                }
                console.log('edge', tolerance, edges, flags, more)
            } else if (line.startsWith('Wi')) {
                // TODO Parse wire
            } else if (line.startsWith('Fa')) {
                // Parse face
                ({line, offset} = advance(data, offset))
                const tolerance = line;
                if (line.trim().split(' ').length != 5) {
                    throw 'Face: Five parts expected!'
                }
                ({line, offset} = advance(data, offset))
                if (line.trim().length != 0) {
                    throw 'Face: Empty line expected!'
                }
                ({line, offset} = advance(data, offset))
                const flags = line;
                if (line.trim().length != 7) {
                    throw 'Face: Seven chars expected!'
                }
                ({line, offset} = advance(data, offset))
                const more = line;
                if (!line.trim().endsWith('*')) {
                    throw 'Face: Star symbol expected!'
                }
                console.log('face', tolerance, flags, more)
            } else if (line.startsWith('Sh')) {
                // TODO Parse shell
            } else if (line.startsWith('So')) {
                // TODO Parse solid
            } else if (line.startsWith('CS')) {
                // TODO Parse compsolid
            } else if (line.startsWith('Co')) {
                // TODO Parse compound
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