import math
import sys

def normalized(x: float, y: float, z: float):
    
    from panda3d.core import LVector3

    myVec = LVector3(x, y, z)
    myVec.normalize()

    return myVec

def makePointCloud(items: list[list[float]], scale = 1.0):
    
    from panda3d.core import GeomVertexFormat
    from panda3d.core import GeomVertexData
    from panda3d.core import GeomVertexWriter
    from panda3d.core import GeomPoints
    from panda3d.core import Geom

    minDepl = sys.float_info.max
    maxDepl = sys.float_info.min

    for item in items:
        x, y, z, dx, dy, dz = item

        depl = math.sqrt(dx * dx + dy * dy + dz * dz)

        minDepl = min(minDepl, depl)
        maxDepl = max(maxDepl, depl)

    format = GeomVertexFormat.getV3n3cpt2()
    data = GeomVertexData('cloud', format, Geom.UHDynamic)

    vertex = GeomVertexWriter(data, 'vertex')
    color = GeomVertexWriter(data, 'color')

    points = GeomPoints(Geom.UHDynamic)

    i = 0
    for item in items:
        x, y, z, dx, dy, dz = item

        depl = math.sqrt(dx * dx + dy * dy + dz * dz)
        perc = (depl - minDepl) / (maxDepl - minDepl)

        vertex.addData3(x, y, z)
        vertex.addData3(x + dx * scale, y + dy * scale, z + dz * scale)

        color.addData4f(1.0, 1.0, 1.0, 1.0)
        color.addData4f(perc, 1.0 - perc, 0.0, 1.0)

        points.addVertex(i + 0)
        points.addVertex(i + 1)

        i = i + 2

    geom = Geom(data)
    geom.addPrimitive(points)

    return geom

def makeQuadPoints(x1: float, y1: float, z1: float, x2: float, y2: float, z2: float):
    
    from panda3d.core import GeomVertexFormat
    from panda3d.core import GeomVertexData
    from panda3d.core import GeomVertexWriter
    from panda3d.core import GeomPoints
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

    points = GeomPoints(Geom.UHDynamic)
    points.addVertex(0)
    points.addVertex(1)
    points.addVertex(2)
    points.addVertex(3)

    geom = Geom(data)
    geom.addPrimitive(points)

    return geom

def makeQuadLines(x1: float, y1: float, z1: float, x2: float, y2: float, z2: float):
    
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

def makeQuadTriangles(x1: float, y1: float, z1: float, x2: float, y2: float, z2: float):
    
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

def makeCubePoints():
    
    from panda3d.core import GeomNode

    quadPoints0 = makeQuadPoints(-1, -1, -1, 1, -1, 1)
    quadPoints1 = makeQuadPoints(-1, 1, -1, 1, 1, 1)
    quadPoints2 = makeQuadPoints(-1, 1, 1, 1, -1, 1)
    quadPoints3 = makeQuadPoints(-1, 1, -1, 1, -1, -1)
    quadPoints4 = makeQuadPoints(-1, -1, -1, -1, 1, 1)
    quadPoints5 = makeQuadPoints(1, -1, -1, 1, 1, 1)

    node = GeomNode('cube-points')
    
    node.addGeom(quadPoints0)
    node.addGeom(quadPoints1)
    node.addGeom(quadPoints2)
    node.addGeom(quadPoints3)
    node.addGeom(quadPoints4)
    node.addGeom(quadPoints5)

    return node

def makeCubeLines():
    
    from panda3d.core import GeomNode

    quadLines0 = makeQuadLines(-1, -1, -1, 1, -1, 1)
    quadLines1 = makeQuadLines(-1, 1, -1, 1, 1, 1)
    quadLines2 = makeQuadLines(-1, 1, 1, 1, -1, 1)
    quadLines3 = makeQuadLines(-1, 1, -1, 1, -1, -1)
    quadLines4 = makeQuadLines(-1, -1, -1, -1, 1, 1)
    quadLines5 = makeQuadLines(1, -1, -1, 1, 1, 1)

    node = GeomNode('cube-lines')
    
    node.addGeom(quadLines0)
    node.addGeom(quadLines1)
    node.addGeom(quadLines2)
    node.addGeom(quadLines3)
    node.addGeom(quadLines4)
    node.addGeom(quadLines5)

    return node

def makeCubeTriangles():
    
    from panda3d.core import GeomNode

    quadTriangles0 = makeQuadTriangles(-1, -1, -1, 1, -1, 1)
    quadTriangles1 = makeQuadTriangles(-1, 1, -1, 1, 1, 1)
    quadTriangles2 = makeQuadTriangles(-1, 1, 1, 1, -1, 1)
    quadTriangles3 = makeQuadTriangles(-1, 1, -1, 1, -1, -1)
    quadTriangles4 = makeQuadTriangles(-1, -1, -1, -1, 1, 1)
    quadTriangles5 = makeQuadTriangles(1, -1, -1, 1, 1, 1)

    node = GeomNode('cube-triangles')

    node.addGeom(quadTriangles0)
    node.addGeom(quadTriangles1)
    node.addGeom(quadTriangles2)
    node.addGeom(quadTriangles3)
    node.addGeom(quadTriangles4)
    node.addGeom(quadTriangles5)

    return node

def makeCube(pointWidth: int, lineWidth: int):

    from panda3d.core import PandaNode
    from panda3d.core import NodePath
    
    # Make cube geometry nodes
    cubePoints = makeCubePoints()
    cubeLines = makeCubeLines()
    cubeTriangles = makeCubeTriangles()

    # Make parent panda node
    cube = PandaNode("cube")
    
    # Make parent nodepath handle and attach cube geometry nodes
    parent = NodePath(cube)
    parent.attachNewNode(cubePoints).setRenderModeThickness(pointWidth)
    parent.attachNewNode(cubeLines).setRenderModeThickness(lineWidth)
    parent.attachNewNode(cubeTriangles).setTwoSided(True)

    return parent