import os
import random

from direct.showbase.ShowBase import ShowBase

from panda3d.core import WindowProperties

from caddrive.http import codeaster
from caddrive.ldraw.parsers import TableParser
from caddrive.simulation.codeaster import PreProcessor
from caddrive.visualization.panda3d import FEAModel, makeFEAPoints, makeFEALines, makeFEATriangles

from config import LDR_FILE, OUT_DIR, JOB_NAME, MAIL_FILE, COMM_FILE, RESU_FILE, SCALE

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

        # Generate FEA model
        preprocessor = PreProcessor(OUT_DIR, JOB_NAME)
        preprocessor.buildLeoFeaModel(parser.tableLeoFeaModel)
        preprocessor.writeInputFiles()

        # Generate FEA result
        codeaster(OUT_DIR, JOB_NAME, MAIL_FILE, COMM_FILE)

        # Parse FEA result
        depl: dict[str, list[float]] = {}
        forc: dict[str, list[float]] = {}
        reac: dict[str, list[float]] = {}

        mode = 0
        with open(RESU_FILE, "r") as file:
            for line in file:
                parts = line.split()
                if len(parts) == 0:
                    mode = 0
                elif parts[0] == "CHAMP":
                    if parts[-1] == "DEPL":
                        mode = 1
                    elif parts[-1] == "FORC_NODA":
                        mode = 2
                    elif parts[-1] == "REAC_NODA":
                        mode = 3
                elif parts[0] == "NUMERO":
                    pass
                elif parts[0] == "NOEUD":
                    pass
                elif mode > 0:
                    name = parts[0]

                    x = float(parts[4])
                    y = float(parts[5])
                    z = float(parts[6])

                    if mode == 1:
                        depl[name] = [x, y, z]
                    elif mode == 2:
                        forc[name] = [x, y, z]
                    elif mode == 3:
                        reac[name] = [x, y, z]

        # Make FEA model
        model = FEAModel()

        offset = 0
        for partId in range(preprocessor.numParts):
            part = preprocessor.parts[partId]
            for k in range(part.num_elz + 1):
                for j in range(part.num_ely + 1):
                    for i in range(part.num_elx + 1):
                        nodeId = part.nodesId[i, j, k]
                        nodeName = f"N{(offset + nodeId):03.0f}"
                        
                        x = part.nodesx[i, j, k]
                        y = part.nodesy[i, j, k]
                        z = part.nodesz[i, j, k]

                        if nodeName in depl:
                            d = depl[nodeName]
                        else:
                            d = [0, 0, 0]
                        
                        if nodeName in forc:
                            f = forc[nodeName]
                        else:
                            f = [0, 0, 0]

                        model.node(nodeName, [x, y, z], d, f)
            offset = offset + part.nodesx.size

        offset = 0
        for partId in range(preprocessor.numParts):
            part = preprocessor.parts[partId]
            for i in range(part.i_fbot):
                n1 = part.fbot[i,0]
                n2 = part.fbot[i,1]
                n3 = part.fbot[i,2]
                n4 = part.fbot[i,3]
                model.quad(f"P{partId}-BO-Q{i}", f"N{(offset + n1):03.0f}", f"N{(offset + n2):03.0f}", f"N{(offset + n3):03.0f}", f"N{(offset + n4):03.0f}")
            for i in range(part.i_ftop):
                n1 = part.ftop[i,0]
                n2 = part.ftop[i,1]
                n3 = part.ftop[i,2]
                n4 = part.ftop[i,3]
                model.quad(f"P{partId}-TO-Q{i}", f"N{(offset + n1):03.0f}", f"N{(offset + n2):03.0f}", f"N{(offset + n3):03.0f}", f"N{(offset + n4):03.0f}")
            for i in range(part.i_fleft):
                n1 = part.fleft[i,0]
                n2 = part.fleft[i,1]
                n3 = part.fleft[i,2]
                n4 = part.fleft[i,3]
                model.quad(f"P{partId}-LE-Q{i}", f"N{(offset + n1):03.0f}", f"N{(offset + n2):03.0f}", f"N{(offset + n3):03.0f}", f"N{(offset + n4):03.0f}")
            for i in range(part.i_fright):
                n1 = part.fright[i,0]
                n2 = part.fright[i,1]
                n3 = part.fright[i,2]
                n4 = part.fright[i,3]
                model.quad(f"P{partId}-RI-Q{i}", f"N{(offset + n1):03.0f}", f"N{(offset + n2):03.0f}", f"N{(offset + n3):03.0f}", f"N{(offset + n4):03.0f}")
            for i in range(part.i_ffront):
                n1 = part.ffront[i,0]
                n2 = part.ffront[i,1]
                n3 = part.ffront[i,2]
                n4 = part.ffront[i,3]
                model.quad(f"P{partId}-FR-Q{i}", f"N{(offset + n1):03.0f}", f"N{(offset + n2):03.0f}", f"N{(offset + n3):03.0f}", f"N{(offset + n4):03.0f}")
            for i in range(part.i_fback):
                n1 = part.fback[i,0]
                n2 = part.fback[i,1]
                n3 = part.fback[i,2]
                n4 = part.fback[i,3]
                model.quad(f"P{partId}-BA-Q{i}", f"N{(offset + n1):03.0f}", f"N{(offset + n2):03.0f}", f"N{(offset + n3):03.0f}", f"N{(offset + n4):03.0f}")
            offset = offset + part.nodesx.size
        
        model.lock()

        # Make FEA geometry
        group = inner.attachNewNode("group")
        group.setPos(-model.xCenter, -model.yCenter, -model.zCenter)

        points = makeFEAPoints(model, 3, SCALE, 3/3)
        points.reparentTo(group)

        lines = makeFEALines(model, 2, SCALE, 2/3)
        lines.reparentTo(group)

        triangles = makeFEATriangles(model, SCALE, 1/3)
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