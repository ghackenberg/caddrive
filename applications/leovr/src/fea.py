from direct.showbase.ShowBase import ShowBase

from panda3d.core import WindowProperties, GeomNode, NodePath

from caddrive.visualization.panda3d import FEAModel, makeFEAPoints

class LeoVR(ShowBase):

    def __init__(self):

        super().__init__(self)

        # Outer rotation about Y axis
        outer = self.render.attachNewNode("outer")
        outer.setHpr(0, 45, 0)

        # Inner rotation about X axis
        inner = outer.attachNewNode("inner")
        inner.setHpr(45, 0, 0)

        # Make FEA model
        model = FEAModel()

        model.node("N1", [-1, -1, -1])
        model.node("N2", [+1, -1, -1])
        model.node("N3", [+1, +1, -1])
        model.node("N4", [-1, -1, -1])
        model.node("N5", [-1, -1, +1])
        model.node("N6", [+1, -1, +1])
        model.node("N7", [+1, +1, +1])
        model.node("N8", [-1, -1, +1])

        model.quad("Q1", "N1", "N2", "N3", "N4")
        model.quad("Q2", "N5", "N6", "N7", "N8")

        # Make FEA geometry
        points = makeFEAPoints(model, 5)
        points.reparentTo(inner)
        
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