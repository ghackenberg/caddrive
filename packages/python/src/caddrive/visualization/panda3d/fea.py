import sys
import numpy

class FEANode:

    def __init__(self, number: int, name: str, position: list[float], displacement = [0.0, 0.0, 0.0], force = [0.0, 0.0, 0.0]):

        self.number = number

        self.name = name

        self.position = position
        self.displacement = displacement
        self.force = force

class FEAQuad:

    def __init__(self, number: int, name: str, node1: FEANode, node2: FEANode, node3: FEANode, node4: FEANode):

        self.number = number

        self.name = name

        self.node1 = node1
        self.node2 = node2
        self.node3 = node3
        self.node4 = node4

        self.nodeList = [node1, node2, node3, node4]

class FEAModel:

    nodeList: list[FEANode] = []
    quadList: list[FEAQuad] = []

    nodeIndex: dict[str, FEANode] = {}
    quadIndex: dict[str, FEAQuad] = {}

    xMin = sys.float_info.max
    xMax = sys.float_info.min

    yMin = sys.float_info.max
    yMax = sys.float_info.min

    zMin = sys.float_info.max
    zMax = sys.float_info.min

    xCenter: float = None
    yCenter: float = None
    zCenter: float = None

    xSpread: float = None
    ySpread: float = None
    zSpread: float = None

    displacementMin = sys.float_info.max
    displacementMax = sys.float_info.min

    displacementSpread: float = None

    forceMin = sys.float_info.max
    forceMax = sys.float_info.min

    forceSpread: float = None

    def node(self, name: str, position: list[float], displacement = [0.0, 0.0, 0.0], force = [0.0, 0.0, 0.0]):
        
        if self.forceSpread is not None:
            raise Exception("Model is already locked!")
        if name in self.nodeIndex:
            raise Exception("Node name already in use!")
        
        node = FEANode(len(self.nodeList), name, position, displacement, force)

        self.nodeList.append(node)
        self.nodeIndex[name] = node

        # Coordinate min/max

        self.xMin = min(self.xMin, position[0])
        self.xMax = max(self.xMax, position[0])

        self.yMin = min(self.yMin, position[1])
        self.yMax = max(self.yMax, position[1])

        self.zMin = min(self.zMin, position[2])
        self.zMax = max(self.zMax, position[2])

        # Displacement min/max

        displacementCurrent = numpy.linalg.norm(displacement)

        self.displacementMin = min(self.displacementMin, displacementCurrent)
        self.displacementMax = max(self.displacementMax, displacementCurrent)

        # Force min/max

        forceCurrent = numpy.linalg.norm(force)

        self.forceMin = min(self.forceMin, forceCurrent)
        self.forceMax = max(self.forceMax, forceCurrent)
    
    def quad(self, name: str, node1: str, node2: str, node3: str, node4: str):
        
        if self.forceSpread is not None:
            raise Exception("Model is already locked!")
        if name in self.quadIndex:
            raise Exception("Quad name already in use!")
        if node1 not in self.nodeIndex:
            raise Exception("Node 1 not defined!")
        if node2 not in self.nodeIndex:
            raise Exception("Node 2 not defined!")
        if node3 not in self.nodeIndex:
            raise Exception("Node 3 not defined!")
        if node4 not in self.nodeIndex:
            raise Exception("Node 4 not defined!")
        
        temp1 = self.nodeIndex[node1]
        temp2 = self.nodeIndex[node2]
        temp3 = self.nodeIndex[node3]
        temp4 = self.nodeIndex[node4]

        quad = FEAQuad(len(self.quadList), name, temp1, temp2, temp3, temp4)

        self.quadList.append(quad)
        self.quadIndex[name] = quad
    
    def lock(self):

        if self.forceSpread is not None:
            raise Exception("Model is already locked!")
        
        self.xSpread = self.xMax - self.xMin
        self.ySpread = self.yMax - self.yMin
        self.zSpread = self.zMax - self.zMin

        self.xCenter = self.xMin + self.xSpread / 2
        self.yCenter = self.yMin + self.ySpread / 2
        self.zCenter = self.zMin + self.zSpread / 2

        self.displacementSpread = self.displacementMax - self.displacementMin

        self.forceSpread = self.forceMax - self.forceMin
    
    def color(self, node: FEANode):

        if self.forceSpread is None:
            raise Exception("Model is not locked yet!")

        if self.displacementSpread > 0:

            displacementAbsolute = numpy.linalg.norm(node.displacement)
            displacementRelative = (displacementAbsolute - self.displacementMin) / self.displacementSpread

            r = displacementRelative
            g = 1.0 - displacementRelative
            b = 0.0

            return r, g, b

        else:

            r = 1.0
            g = 1.0
            b = 1.0

            return r, g, b

def makeFEAPoints(model: FEAModel, thickness = 1, displacementScale = 1.0, colorScale = 1.0):

    # Import
    
    from panda3d.core import GeomVertexFormat
    from panda3d.core import GeomVertexData
    from panda3d.core import GeomVertexWriter
    from panda3d.core import GeomPoints
    from panda3d.core import GeomNode
    from panda3d.core import Geom
    from panda3d.core import NodePath

    # Define format

    format = GeomVertexFormat.getV3n3cpt2()

    # Build data

    data = GeomVertexData('points', format, Geom.UHDynamic)

    # Write vertex data

    vertex = GeomVertexWriter(data, 'vertex')

    for node in model.nodeList:

        px, py, pz = node.position
        dx, dy, dz = node.displacement

        vertex.addData3(px + dx * displacementScale, py + dy * displacementScale, pz + dz * displacementScale)

    # Write color data

    color = GeomVertexWriter(data, 'color')

    for node in model.nodeList:

        r, g, b = model.color(node)

        color.addData4f(r * colorScale, g * colorScale, b * colorScale, 1.0)

    # Build points

    points = GeomPoints(Geom.UHDynamic)

    i = 0
    for node in model.nodeList:

        points.addVertex(i)

        i = i + 1
    
    geom = Geom(data)
    geom.addPrimitive(points)

    node = GeomNode("points")
    node.addGeom(geom)

    path = NodePath(node)
    path.setRenderModeThickness(thickness)

    return path

def makeFEALines(model: FEAModel, thickness = 1, displacementScale = 1.0, colorScale = 1.0):

    # Import classes
    
    from panda3d.core import GeomVertexFormat
    from panda3d.core import GeomVertexData
    from panda3d.core import GeomVertexWriter
    from panda3d.core import GeomLines
    from panda3d.core import GeomNode
    from panda3d.core import Geom
    from panda3d.core import NodePath

    format = GeomVertexFormat.getV3n3cpt2()

    # Build data

    data = GeomVertexData('points', format, Geom.UHDynamic)

    # Write vertex data

    vertex = GeomVertexWriter(data, 'vertex')

    for node in model.nodeList:

        px, py, pz = node.position
        dx, dy, dz = node.displacement

        vertex.addData3(px + dx * displacementScale, py + dy * displacementScale, pz + dz * displacementScale)

    # Write color data

    color = GeomVertexWriter(data, 'color')

    for node in model.nodeList:

        r, g, b = model.color(node)

        color.addData4f(r * colorScale, g * colorScale, b * colorScale, 1.0)

    # Build lines
        
    cache: dict[str, bool] = {}

    lines = GeomLines(Geom.UHDynamic)

    for quad in model.quadList:

        line1 = f"{quad.node1.number}-{quad.node2.number}"
        line2 = f"{quad.node2.number}-{quad.node3.number}"
        line3 = f"{quad.node3.number}-{quad.node4.number}"
        line4 = f"{quad.node4.number}-{quad.node1.number}"
        
        if line1 not in cache:
            lines.addVertices(quad.node1.number, quad.node2.number)
        if line2 not in cache:
            lines.addVertices(quad.node2.number, quad.node3.number)
        if line3 not in cache:
            lines.addVertices(quad.node3.number, quad.node4.number)
        if line4 not in cache:
            lines.addVertices(quad.node4.number, quad.node1.number)
        
        cache[line1] = True
        cache[line2] = True
        cache[line3] = True
        cache[line4] = True

    # Build geom
    
    geom = Geom(data)
    geom.addPrimitive(lines)

    # Build node

    node = GeomNode("lines")
    node.addGeom(geom)

    # Build path

    path = NodePath(node)
    path.setRenderModeThickness(thickness)

    return path

def makeFEATriangles(model: FEAModel, displacementScale = 1.0, colorScale = 1.0):

    # Import classes
    
    from panda3d.core import GeomVertexFormat
    from panda3d.core import GeomVertexData
    from panda3d.core import GeomVertexWriter
    from panda3d.core import GeomTriangles
    from panda3d.core import GeomNode
    from panda3d.core import Geom
    from panda3d.core import NodePath

    format = GeomVertexFormat.getV3n3cpt2()

    # Build data

    data = GeomVertexData('points', format, Geom.UHDynamic)

    # Write vertex data

    vertex = GeomVertexWriter(data, 'vertex')

    for quad in model.quadList:

        for node in quad.nodeList:

            px, py, pz = node.position
            dx, dy, dz = node.displacement

            vertex.addData3(px + dx * displacementScale, py + dy * displacementScale, pz + dz * displacementScale)

    # Write color data

    color = GeomVertexWriter(data, 'color')

    for quad in model.quadList:

        for node in quad.nodeList:

            r, g, b = model.color(node)

            color.addData4f(r * colorScale, g * colorScale, b * colorScale, 1.0)

    # Build lines

    triangles = GeomTriangles(Geom.UHDynamic)

    for quad in model.quadList:

        triangles.addVertices(quad.number * 4 + 0, quad.number * 4 + 1, quad.number * 4 + 2)
        triangles.addVertices(quad.number * 4 + 2, quad.number * 4 + 3, quad.number * 4 + 0)

    # Build geom
    
    geom = Geom(data)
    geom.addPrimitive(triangles)

    # Build node

    node = GeomNode("triangles")
    node.addGeom(geom)

    # Build path

    path = NodePath(node)
    path.setTwoSided(True)

    return path