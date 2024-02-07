from direct.showbase.ShowBase import ShowBase

from panda3d.core import GeomNode

from caddrive.visualization.panda3d.util import makeCube

class LeoVR(ShowBase):

    def __init__(self):

        super().__init__(self)

        node = makeCube()

        nodePath = self.render.attachNewNode(node)
        nodePath.setRenderModeThickness(2)
        nodePath.setTwoSided(True)
        nodePath.setHpr(0, -45, 45)

        self.disableMouse()
        self.camera.setPos(0, -20, 0)

app = LeoVR()
app.run()