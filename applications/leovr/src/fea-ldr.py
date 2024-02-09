import os
import random

from direct.showbase.ShowBase import ShowBase

from panda3d.core import WindowProperties

from caddrive.ldraw.parsers import TableParser
from caddrive.simulation.codeaster import PreProcessor
from caddrive.visualization.panda3d import FEAModel, makeFEAPoints, makeFEALines, makeFEATriangles

from config import LDR_FILE, OUT_DIR, JOB_NAME

def randomScalar(min: float, max: float):

    return min + random.random() * (max - min)

def randomVector(min = -0.2, max = 0.2):

    x = randomScalar(min, max)
    y = randomScalar(min, max)
    z = randomScalar(min, max)

    return x, y, z

# Ensure output folder
if not os.path.exists(OUT_DIR): os.makedirs(OUT_DIR)

class LeoVR(ShowBase):

    def __init__(self):

        super().__init__(self)

        # Outer rotation about Y axis
        outer = self.render.attachNewNode("outer")
        outer.hprInterval(10.0, (0, 360, 0)).loop()

        # Inner rotation about X axis
        inner = outer.attachNewNode("inner")
        inner.hprInterval(5.0, (360, 0, 0)).loop()

        # Parse CAD model
        parser = TableParser()
        parser.readFileLDR(LDR_FILE)

        # Preprocess CAD model
        preprocessor = PreProcessor(OUT_DIR, JOB_NAME)
        preprocessor.buildLeoFeaModel(parser.tableLeoFeaModel)
        preprocessor.writeInputFiles()

        # Make FEA model
        model = FEAModel()

        for partId in range(preprocessor.numParts):
            part = preprocessor.parts[partId]
            for k in range(part.num_elz + 1):
                for j in range(part.num_ely + 1):
                    for i in range(part.num_elx + 1):
                        nodeId = part.nodesId[i, j, k]
                        x = part.nodesx[i, j, k]
                        y = part.nodesy[i, j, k]
                        z = part.nodesz[i, j, k]
                        model.node(f"P{partId}-N{nodeId}", [x, y, z], randomVector(), randomVector())

        for partId in range(preprocessor.numParts):
            part = preprocessor.parts[partId]
            for i in range(part.i_fbot):
                n1 = part.fbot[i,0]
                n2 = part.fbot[i,1]
                n3 = part.fbot[i,2]
                n4 = part.fbot[i,3]
                model.quad(f"P{partId}-BO-Q{i}", f"P{partId}-N{n1}", f"P{partId}-N{n2}", f"P{partId}-N{n3}", f"P{partId}-N{n4}")
            for i in range(part.i_ftop):
                n1 = part.ftop[i,0]
                n2 = part.ftop[i,1]
                n3 = part.ftop[i,2]
                n4 = part.ftop[i,3]
                model.quad(f"P{partId}-TO-Q{i}", f"P{partId}-N{n1}", f"P{partId}-N{n2}", f"P{partId}-N{n3}", f"P{partId}-N{n4}")
            for i in range(part.i_fleft):
                n1 = part.fleft[i,0]
                n2 = part.fleft[i,1]
                n3 = part.fleft[i,2]
                n4 = part.fleft[i,3]
                model.quad(f"P{partId}-LE-Q{i}", f"P{partId}-N{n1}", f"P{partId}-N{n2}", f"P{partId}-N{n3}", f"P{partId}-N{n4}")
            for i in range(part.i_fright):
                n1 = part.fright[i,0]
                n2 = part.fright[i,1]
                n3 = part.fright[i,2]
                n4 = part.fright[i,3]
                model.quad(f"P{partId}-RI-Q{i}", f"P{partId}-N{n1}", f"P{partId}-N{n2}", f"P{partId}-N{n3}", f"P{partId}-N{n4}")
            for i in range(part.i_ffront):
                n1 = part.ffront[i,0]
                n2 = part.ffront[i,1]
                n3 = part.ffront[i,2]
                n4 = part.ffront[i,3]
                model.quad(f"P{partId}-FR-Q{i}", f"P{partId}-N{n1}", f"P{partId}-N{n2}", f"P{partId}-N{n3}", f"P{partId}-N{n4}")
            for i in range(part.i_fback):
                n1 = part.fback[i,0]
                n2 = part.fback[i,1]
                n3 = part.fback[i,2]
                n4 = part.fback[i,3]
                model.quad(f"P{partId}-BA-Q{i}", f"P{partId}-N{n1}", f"P{partId}-N{n2}", f"P{partId}-N{n3}", f"P{partId}-N{n4}")
        
        model.lock()

        # Make FEA geometry
        group = inner.attachNewNode("group")
        group.setPos(-model.xCenter, -model.yCenter, -model.zCenter)

        points = makeFEAPoints(model, 3, 1.0, 3/3)
        points.reparentTo(group)

        lines = makeFEALines(model, 2, 1.0, 2/3)
        lines.reparentTo(group)

        triangles = makeFEATriangles(model, 1.0, 1/3)
        triangles.reparentTo(group)
        
        # Mouse configuration
        self.disableMouse()

        # Camera configuration
        self.camera.setPos(0, -600, 0)
        
        # Set window properties
        props = WindowProperties()
        props.setTitle('LeoVR')

        self.win.requestProperties(props)

app = LeoVR()
app.run()