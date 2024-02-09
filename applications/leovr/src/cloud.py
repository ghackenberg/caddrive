import random

from direct.showbase.ShowBase import ShowBase

from panda3d.core import GeomNode
from panda3d.core import NodePath
from panda3d.core import WindowProperties

from caddrive.visualization.panda3d import makePointCloud

class LeoVR(ShowBase):

    def __init__(self):

        super().__init__(self)

        # Create data
        items: list[list[float]] = []

        for x in range(-30, 31, 10):
            for y in range(-30, 31, 10):
                for z in range(-30, 31, 10):
                    dx = (random.random() - 0.5) * 2 * 0.2
                    dy = (random.random() - 0.5) * 2 * 0.2
                    dz = (random.random() - 0.5) * 2 * 0.2

                    items.append([x / 10, y / 10, z / 10, dx, dy, dz])

        # Outer rotation about Y axis
        outer = self.render.attachNewNode("outer")
        outer.setHpr(0, 45, 0)

        # Inner rotation about X axis
        inner = outer.attachNewNode("inner")
        inner.setHpr(60, 0, 0)

        # Create cloud
        cloudGeom = makePointCloud(items)

        cloudNode = GeomNode("cloud")
        cloudNode.addGeom(cloudGeom)

        cloudPath = NodePath(cloudNode)
        cloudPath.setRenderModeThickness(10)
        cloudPath.reparentTo(inner)
        
        # Mouse configuration
        self.disableMouse()

        # Camera configuration
        self.camera.setPos(0, -20, 0)
        
        # Set window properties
        props = WindowProperties()
        props.setTitle('LeoVR')

        self.win.requestProperties(props)

app = LeoVR()
app.run()