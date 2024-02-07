def normalized(x: float, y: float, z: float):
    
    from panda3d.core import LVector3

    myVec = LVector3(x, y, z)
    myVec.normalize()

    return myVec

def makeQuadFill(x1: float, y1: float, z1: float, x2: float, y2: float, z2: float):
    
    from panda3d.core import GeomVertexFormat
    from panda3d.core import GeomVertexData
    from panda3d.core import GeomVertexWriter
    from panda3d.core import GeomTriangles
    from panda3d.core import Geom

    format = GeomVertexFormat.getV3n3cpt2()
    data = GeomVertexData('square', format, Geom.UHDynamic)

    vertex = GeomVertexWriter(data, 'vertex')
    normal = GeomVertexWriter(data, 'normal')
    color = GeomVertexWriter(data, 'color')
    texcoord = GeomVertexWriter(data, 'texcoord')

    if x1 != x2:
        vertex.addData3(x1, y1, z1)
        vertex.addData3(x2, y1, z1)
        vertex.addData3(x2, y2, z2)
        vertex.addData3(x1, y2, z2)

        normal.addData3(normalized(2 * x1 - 1, 2 * y1 - 1, 2 * z1 - 1))
        normal.addData3(normalized(2 * x2 - 1, 2 * y1 - 1, 2 * z1 - 1))
        normal.addData3(normalized(2 * x2 - 1, 2 * y2 - 1, 2 * z2 - 1))
        normal.addData3(normalized(2 * x1 - 1, 2 * y2 - 1, 2 * z2 - 1))

    else:
        vertex.addData3(x1, y1, z1)
        vertex.addData3(x2, y2, z1)
        vertex.addData3(x2, y2, z2)
        vertex.addData3(x1, y1, z2)

        normal.addData3(normalized(2 * x1 - 1, 2 * y1 - 1, 2 * z1 - 1))
        normal.addData3(normalized(2 * x2 - 1, 2 * y2 - 1, 2 * z1 - 1))
        normal.addData3(normalized(2 * x2 - 1, 2 * y2 - 1, 2 * z2 - 1))
        normal.addData3(normalized(2 * x1 - 1, 2 * y1 - 1, 2 * z2 - 1))

    color.addData4f(0.5, 0.0, 0.0, 1.0)
    color.addData4f(0.0, 0.5, 0.0, 1.0)
    color.addData4f(0.0, 0.0, 0.5, 1.0)
    color.addData4f(0.5, 0.0, 0.5, 1.0)

    texcoord.addData2f(0.0, 1.0)
    texcoord.addData2f(0.0, 0.0)
    texcoord.addData2f(1.0, 0.0)
    texcoord.addData2f(1.0, 1.0)

    triangles = GeomTriangles(Geom.UHDynamic)
    triangles.addVertices(0, 1, 3)
    triangles.addVertices(1, 2, 3)

    geom = Geom(data)
    geom.addPrimitive(triangles)

    return geom

def makeQuadLine(x1: float, y1: float, z1: float, x2: float, y2: float, z2: float):
    
    from panda3d.core import GeomVertexFormat
    from panda3d.core import GeomVertexData
    from panda3d.core import GeomVertexWriter
    from panda3d.core import GeomLines
    from panda3d.core import Geom

    format = GeomVertexFormat.getV3n3cpt2()
    data = GeomVertexData('square', format, Geom.UHDynamic)

    vertex = GeomVertexWriter(data, 'vertex')
    color = GeomVertexWriter(data, 'color')

    if x1 != x2:
        vertex.addData3(x1, y1, z1)
        vertex.addData3(x2, y1, z1)
        vertex.addData3(x2, y2, z2)
        vertex.addData3(x1, y2, z2)

    else:
        vertex.addData3(x1, y1, z1)
        vertex.addData3(x2, y2, z1)
        vertex.addData3(x2, y2, z2)
        vertex.addData3(x1, y1, z2)

    color.addData4f(1.0, 0.0, 0.0, 1.0)
    color.addData4f(0.0, 1.0, 0.0, 1.0)
    color.addData4f(0.0, 0.0, 1.0, 1.0)
    color.addData4f(1.0, 0.0, 1.0, 1.0)

    lines = GeomLines(Geom.UHDynamic)
    lines.addVertices(0, 1)
    lines.addVertices(1, 2)
    lines.addVertices(2, 3)
    lines.addVertices(3, 0)

    geom = Geom(data)
    geom.addPrimitive(lines)

    return geom

def makeCube():
    
    from panda3d.core import GeomNode

    quadLine0 = makeQuadLine(-1, -1, -1, 1, -1, 1)
    quadLine1 = makeQuadLine(-1, 1, -1, 1, 1, 1)
    quadLine2 = makeQuadLine(-1, 1, 1, 1, -1, 1)
    quadLine3 = makeQuadLine(-1, 1, -1, 1, -1, -1)
    quadLine4 = makeQuadLine(-1, -1, -1, -1, 1, 1)
    quadLine5 = makeQuadLine(1, -1, -1, 1, 1, 1)

    quadFill0 = makeQuadFill(-1, -1, -1, 1, -1, 1)
    quadFill1 = makeQuadFill(-1, 1, -1, 1, 1, 1)
    quadFill2 = makeQuadFill(-1, 1, 1, 1, -1, 1)
    quadFill3 = makeQuadFill(-1, 1, -1, 1, -1, -1)
    quadFill4 = makeQuadFill(-1, -1, -1, -1, 1, 1)
    quadFill5 = makeQuadFill(1, -1, -1, 1, 1, 1)

    node = GeomNode('square')
    
    node.addGeom(quadLine0)
    node.addGeom(quadLine1)
    node.addGeom(quadLine2)
    node.addGeom(quadLine3)
    node.addGeom(quadLine4)
    node.addGeom(quadLine5)

    node.addGeom(quadFill0)
    node.addGeom(quadFill1)
    node.addGeom(quadFill2)
    node.addGeom(quadFill3)
    node.addGeom(quadFill4)
    node.addGeom(quadFill5)

    return node