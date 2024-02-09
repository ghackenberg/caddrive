import random

from direct.showbase.ShowBase import ShowBase

from panda3d.core import WindowProperties

from caddrive.visualization.panda3d import FEAModel, makeFEAPoints, makeFEALines, makeFEATriangles

def randomScalar(min: float, max: float):

    return min + random.random() * (max - min)

def randomVector(min = -0.2, max = 0.2):

    x = randomScalar(min, max)
    y = randomScalar(min, max)
    z = randomScalar(min, max)

    return x, y, z

class LeoVR(ShowBase):

    def __init__(self):

        super().__init__(self)

        # Outer rotation about Y axis
        outer = self.render.attachNewNode("outer")
        outer.hprInterval(10.0, (0, 360, 0)).loop()

        # Inner rotation about X axis
        inner = outer.attachNewNode("inner")
        inner.hprInterval(5.0, (360, 0, 0)).loop()

        # Make FEA model
        model = FEAModel()

        model.node("N1", [-1, -1, -1], randomVector(), randomVector())
        model.node("N2", [+1, -1, -1], randomVector(), randomVector())
        model.node("N3", [+1, +1, -1], randomVector(), randomVector())
        model.node("N4", [-1, +1, -1], randomVector(), randomVector())
        model.node("N5", [-1, -1, +1], randomVector(), randomVector())
        model.node("N6", [+1, -1, +1], randomVector(), randomVector())
        model.node("N7", [+1, +1, +1], randomVector(), randomVector())
        model.node("N8", [-1, +1, +1], randomVector(), randomVector())

        model.quad("Q1", "N1", "N2", "N3", "N4")
        model.quad("Q2", "N5", "N6", "N7", "N8")

        model.quad("Q3", "N1", "N2", "N6", "N5")
        model.quad("Q4", "N3", "N4", "N8", "N7")

        model.quad("Q5", "N1", "N4", "N8", "N5")
        model.quad("Q6", "N2", "N3", "N7", "N6")

        model.lock()

        # Make FEA geometry
        points = makeFEAPoints(model, 5, 1.0, 3/3)
        points.reparentTo(inner)

        lines = makeFEALines(model, 2, 1.0, 2/3)
        lines.reparentTo(inner)

        triangles = makeFEATriangles(model, 1.0, 1/3)
        triangles.reparentTo(inner)
        
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