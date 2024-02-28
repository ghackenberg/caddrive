import os
import sys
import subprocess

from requests.exceptions import ConnectionError

from direct.showbase.ShowBase import ShowBase
from direct.gui.OnscreenText import OnscreenText
from direct.stdpy import threading

from panda3d.core import loadPrcFileData, WindowProperties, AntialiasAttrib, ClockObject, NodePath, PandaNode

from caddrive.http import codeaster, CodeasterRequestFailed, CodeasterResponseUnexpected
from caddrive.ldraw.parsers import TableParser
from caddrive.simulation.codeaster import PreProcessor
from caddrive.visualization.panda3d import FEAVector, FEAModel, makeFEAPoints, makeFEALines, makeFEATriangles

from config import LDR_FILE_A, LDR_FILE_C, LDR_FILE_D, OUT_DIR, SCALE

FPS = 30.0

WIDTH = 800
HEIGHT = 600

FILE = 'test.mkv'

COMMAND = ('ffmpeg', '-y', '-r', f'{FPS}', '-an', '-analyzeduration', '0', '-s', f'{WIDTH}x{HEIGHT}', '-f', 'rawvideo', '-pix_fmt', 'bgra', '-i', '-', '-vf', 'vflip', '-vcodec', 'libx264rgb', '-qp', '0', '-crf', '0', FILE)
                 
PROCESS = subprocess.Popen(COMMAND, stdin=subprocess.PIPE, bufsize=-1, shell=False)

loadPrcFileData('', 'framebuffer-multisample 1\nmultisamples 8')

class LeoVR(ShowBase):

    def __init__(self):

        super().__init__(self)
        
        # Set window properties
        props = WindowProperties()
        props.setTitle('LeoVR')
        props.setSize(WIDTH, HEIGHT)

        self.win.requestProperties(props)

        # Escape
        self.accept("escape", self._quit)

        # Antialias
        self.render.setAntialias(AntialiasAttrib.MMultisample)

        # Clock
        self.time = ClockObject.getGlobalClock()
        self.time.setMode(ClockObject.MNonRealTime)
        self.time.setDt(1.0 / float(FPS))

        # Task
        self.task = self.taskMgr.add(self._task, "task")
        self.task.setUponDeath(lambda: self.time.setMode(ClockObject.MNormal))

        # Load FEA model
        self.thread = threading.Thread(target=lambda: self._load())
        self.thread.start()
        
        # Mouse configuration
        self.disableMouse()

        # Camera configuration
        self.camera.setPos(0, -500, -20)

    def _load(self):

        try:

            # Setup
            self.message = OnscreenText("Loading ...")

            # Outer rotation about Y axis
            pitch = self.render.attachNewNode("pitch")
            pitch.setHpr(0, 20, 0)

            # Inner rotation about X axis
            yaw = pitch.attachNewNode("yaw")
            yaw.hprInterval(15, (360, 0, 0)).loop()

            # Loading models
            modelA = self._loadFEAModel(LDR_FILE_A, OUT_DIR, "job_a")
            modelB = self._loadFEAModel(LDR_FILE_C, OUT_DIR, "job_c")
            modelC = self._loadFEAModel(LDR_FILE_D, OUT_DIR, "job_d")

            # Update models
            models = [modelA, modelB, modelC]

            displacementMin = sys.float_info.max
            displacementMax = sys.float_info.min

            forceMin = sys.float_info.max
            forceMax = sys.float_info.min

            angleMin = sys.float_info.max
            angleMax = sys.float_info.min

            for model in models:

                # Update local displacement
                displacementMin = min(displacementMin, model.displacementMin)
                displacementMax = max(displacementMax, model.displacementMax)

                # Update local force
                forceMin = min(forceMin, model.forceMin)
                forceMax = max(forceMax, model.forceMax)

                # Update local angle
                angleMin = min(angleMin, model.angleMin)
                angleMax = max(angleMax, model.angleMax)
            
            for model in models:

                # Update model displacement
                model.displacementMin = displacementMin
                model.displacementMax = displacementMax

                model.displacementSpread = displacementMax - displacementMin

                # Update model force
                model.forceMin = forceMin
                model.forceMax = forceMax

                model.forceSpread = forceMax - forceMin

                # Update model angle
                model.angleMin = angleMin
                model.angleMax = angleMax

                model.angleSpread = angleMax - angleMin

            # Rendering models
            self._renderFEAModel("job_a", modelA, (0, -100, 0)).reparentTo(yaw)
            self._renderFEAModel("job_b", modelB, (0,    0, 0)).reparentTo(yaw)
            self._renderFEAModel("job_c", modelC, (0,   80, 0)).reparentTo(yaw)
            
            # Cleanup
            self.message.destroy()
        
        except FileNotFoundError:
            self.message.setText("LDraw model is not available!")
        except ConnectionError:
            self.message.setText("CodeAster service is not reachable!")
        except CodeasterRequestFailed:
            self.message.setText("CodeAster service request failed!")
        except CodeasterResponseUnexpected:
            self.message.setText("CodeAster service response unexpected!")
        except Exception as e:
            print(e)
            self.message.setText("An unexpected error occurred!")
    
    def _loadFEAModel(self, ldrFile: str, outDir: str, jobName: str):

        if not os.path.exists(outDir): os.makedirs(outDir)

        mailFile = f"{outDir}/{jobName}.mail"
        commFile = f"{outDir}/{jobName}.comm"
        resuFile = f"{outDir}/{jobName}.resu"

        # Parse CAD model
        self.message.setText(f"Parsing {jobName} LDR ...")

        parser = TableParser()
        parser.readFileLDR(ldrFile)

        # Generate FEA model
        self.message.setText(f"Generating {jobName} MAIL/COMM ...")

        preprocessor = PreProcessor(outDir, jobName)
        preprocessor.buildLeoFeaModel(parser.tableLeoFeaModel)
        preprocessor.writeInputFiles()

        # Generate FEA result
        self.message.setText(f"Simulating {jobName} ...")

        if not os.path.exists(resuFile):
            codeaster(outDir, jobName, mailFile, commFile)

        # Parse FEA result
        self.message.setText(f"Parsing {jobName} RESU ...")

        depl: dict[str, FEAVector] = {}
        forc: dict[str, FEAVector] = {}
        reac: dict[str, FEAVector] = {}

        mode = 0
        with open(resuFile, "r") as file:
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

        # Translating FEA result
        self.message.setText(f"Translating {jobName} ...")

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
                            d = (0.0, 0.0, 0.0)
                        
                        if nodeName in forc:
                            f = forc[nodeName]
                        else:
                            f = (0.0, 0.0, 0.0)

                        model.node(nodeName, (x, y, z), d, f)
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

        return model
    
    def _renderFEAModel(self, jobName: str, model: FEAModel, pos: FEAVector):

        # Make FEA geometry
        self.message.setText(f"Visualizing {jobName} ...")

        group = NodePath(PandaNode(jobName))
        group.setPos(pos[0] - model.xCenter, pos[1] - model.yCenter, pos[2] - model.zCenter)

        #points = makeFEAPoints(model, 2, SCALE, 1.0)
        #points.reparentTo(group)

        lines = makeFEALines(model, 2, SCALE, 1.0)
        lines.reparentTo(group)

        triangles = makeFEATriangles(model, SCALE, 0.5)
        triangles.reparentTo(group)

        return group
    
    def _task(self, task):
        screenshot = base.win.getScreenshot()
        data = screenshot.getRamImage().getData()
        PROCESS.stdin.write(data)
        return task.cont

    def _quit(self):
        PROCESS.stdin.close()
        sys.exit()

app = LeoVR()
app.run()