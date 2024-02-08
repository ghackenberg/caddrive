from direct.showbase.ShowBase import ShowBase

from caddrive.visualization.panda3d.util import makeCube

class LeoVR(ShowBase):

    def __init__(self):

        super().__init__(self)

        makeCube(self.render)

        self.disableMouse()
        self.camera.setPos(0, -20, 0)

app = LeoVR()
app.run()