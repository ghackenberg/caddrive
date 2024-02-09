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

class FEAModel:

    nodeList: list[FEANode] = []
    quadList: list[FEAQuad] = []

    nodeIndex: dict[str, FEANode] = {}
    quadIndex: dict[str, FEAQuad] = {}

    displacementMax = sys.float_info.min
    displacementMin = sys.float_info.max

    forceMax = sys.float_info.min
    forceMin = sys.float_info.max

    def node(self, name: str, position: list[float], displacement = [0.0, 0.0, 0.0], force = [0.0, 0.0, 0.0]):
        
        if name in self.nodeIndex:
            raise Exception("Node name already in use!")
        
        node = FEANode(len(self.nodeList), name, position, displacement, force)

        self.nodeList.append(node)
        self.nodeIndex[name] = node

        displacementCurrent = numpy.linalg.norm(displacement)

        self.displacementMin = min(self.displacementMin, displacementCurrent)
        self.displacementMax = max(self.displacementMax, displacementCurrent)

        forceCurrent = numpy.linalg.norm(force)

        self.forceMin = min(self.forceMin, forceCurrent)
        self.forceMax = max(self.forceMax, forceCurrent)
    
    def quad(self, name: str, node1: str, node2: str, node3: str, node4: str):
        
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

def makeFEAPoints(model: FEAModel, thickness = 1, scale = 1.0):
    
    from panda3d.core import GeomVertexFormat
    from panda3d.core import GeomVertexData
    from panda3d.core import GeomVertexWriter
    from panda3d.core import GeomPoints
    from panda3d.core import GeomNode
    from panda3d.core import Geom
    from panda3d.core import NodePath

    forceSpread = model.forceMax - model.forceMin

    format = GeomVertexFormat.getV3n3cpt2()
    data = GeomVertexData('points', format, Geom.UHDynamic)

    vertex = GeomVertexWriter(data, 'vertex')
    color = GeomVertexWriter(data, 'color')

    points = GeomPoints(Geom.UHDynamic)

    i = 0
    for node in model.nodeList:

        # Add vertex

        px, py, pz = node.position
        dx, dy, dz = node.displacement

        vertex.addData3(px + dx * scale, py + dy * scale, pz + dz * scale)

        forceAbsolute = numpy.linalg.norm(node.force)
        forceRelative = (forceAbsolute - model.forceMin) / forceSpread

        # Add color

        if forceSpread > 0:
            r = forceRelative
            g = 1.0 - forceRelative
            b = 0.0
        else:
            r = 1.0
            g = 1.0
            b = 1.0

        color.addData4f(r, g, b, 1.0)

        # Add point

        points.addVertex(i)

        # Increment

        i = i + 1
    
    geom = Geom(data)
    geom.addPrimitive(points)

    node = GeomNode("points")
    node.addGeom(geom)

    path = NodePath(node)
    path.setRenderModeThickness(thickness)

    return path