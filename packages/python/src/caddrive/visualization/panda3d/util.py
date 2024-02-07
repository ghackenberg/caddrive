def normalized(x: float, y: float, z: float):
    
    from panda3d.core import LVector3

    myVec = LVector3(x, y, z)
    myVec.normalize()

    return myVec

def makeSquare(x1: float, y1: float, z1: float, x2: float, y2: float, z2: float):
    
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

    color.addData4f(1.0, 0.0, 0.0, 1.0)
    color.addData4f(0.0, 1.0, 0.0, 1.0)
    color.addData4f(0.0, 0.0, 1.0, 1.0)
    color.addData4f(1.0, 0.0, 1.0, 1.0)

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