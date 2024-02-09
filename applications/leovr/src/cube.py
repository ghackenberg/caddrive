from direct.showbase.ShowBase import ShowBase

from panda3d.core import WindowProperties

from caddrive.visualization.panda3d import makeCube

class LeoVR(ShowBase):

    def __init__(self):

        super().__init__(self)

        # Outer rotation about Y axis
        outer = self.render.attachNewNode("outer")
        outer.setHpr(0, 45, 0)

        # Inner rotation about X axis
        inner = outer.attachNewNode("inner")
        inner.setHpr(45, 0, 0)

        # Create an array of cubes
        for x in range(-3, 4, 3):
            for y in range(-3, 4, 3):
                cube = makeCube(10, 5)
                cube.reparentTo(inner)
                cube.setPos(x, y, 0)
        
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