from direct.showbase.ShowBase import ShowBase

from panda3d.core import GeomNode

from caddrive.visualization.panda3d.util import makeSquare

class LeoVR(ShowBase):

    def __init__(self):

        super().__init__(self)

        geom0 = makeSquare(-1, -1, -1, 1, -1, 1)
        geom1 = makeSquare(-1, 1, -1, 1, 1, 1)
        geom2 = makeSquare(-1, 1, 1, 1, -1, 1)
        geom3 = makeSquare(-1, 1, -1, 1, -1, -1)
        geom4 = makeSquare(-1, -1, -1, -1, 1, 1)
        geom5 = makeSquare(1, -1, -1, 1, 1, 1)

        node = GeomNode('square')
        node.addGeom(geom0)
        node.addGeom(geom1)
        node.addGeom(geom2)
        node.addGeom(geom3)
        node.addGeom(geom4)
        node.addGeom(geom5)

        path = self.render.attachNewNode(node)
        path.setTwoSided(True)
        path.setHpr(0, -45, 45)

        self.disableMouse()
        self.camera.setPos(0, -20, 0)

app = LeoVR()
app.run()