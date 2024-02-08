#! /usr/bin/python3

# External dependencies

import os
import sys

from importlib.resources import as_file

from PyQt5 import QtWidgets, uic
from PyQt5 import QtGui
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *

# Internal dependencies

import caddrive

from config import RESOURCES, EXAMPLES_DIR, OUT_DIR, JOB_NAME

# Ensure folder

if not os.path.exists(OUT_DIR): os.makedirs(OUT_DIR)

# Class declaration

class LeoFEAGUI(QtWidgets.QDialog):

    def __init__(self, parent=None):

        super().__init__(parent)

        self.version = "6.5.1"

        self.tableLDR = []

        self.resultsMinForce = [0, [0,0,0]]
        self.resultsMaxForce = [0, [0,0,0]]
        self.resultsMinDispl = [0, [0,0,0]]
        self.resultsMaxDispl = [0, [0,0,0]]

        self.workdir = os.path.abspath(OUT_DIR)

        self.defaultLDrawModelName = os.path.abspath(os.path.join(EXAMPLES_DIR, "CADdrive.ldr"))

        self.initUI()

    def initUI(self):

        resDialog = RESOURCES.joinpath('dialog.ui')

        with as_file(resDialog) as file:

            self.ui = uic.loadUi(file.absolute(), self)   # Created with QT5 Designer

            # Slots (connect Buttons with methods)
            self.ui.button_SelectWorkdir.clicked.connect(self.onButton_selectWorkdir)
            self.ui.button_SelectLDR.clicked.connect(self.onButton_selectLDrawModel)
            self.ui.button_LoadLDR.clicked.connect(self.onButton_loadLDrawModel)
            self.ui.button_startFEA.clicked.connect(self.onButton_startFEA)
            self.ui.button_viewPNG.clicked.connect(self.onButton_viewPNG)
            self.ui.button_checkLimitValues.clicked.connect(self.onButton_checkLimitValues)
            self.ui.button_openLeoCAD.clicked.connect(self.onButton_openLeoCAD)
            self.ui.button_openParaview.clicked.connect(self.onButton_openParaView)

            # Initialize Combobox
            self.ui.combo_Analysis.addItem('Static');     self.comboIndexStatic = 0
            self.ui.combo_Analysis.addItem('Modal');      self.comboIndexModal = 1
            self.ui.combo_Analysis.addItem('Dynamic');    self.comboIndexDynamic = 2
            self.ui.combo_Analysis.addItem('Damage');     self.comboIndexDamage = 3

            # Initialize textboxes
            self.ui.textbox_jobname.setText("caddrive")
            self.ui.textbox_FilenameLDR.setText(self.defaultLDrawModelName)
            self.ui.textbox_workdir.setText(self.workdir)

            loadScale = 100

            self.ui.textbox_gravityScale.setText(str(loadScale))
            self.ui.textbox_maxForce.setText(str(0.1 * loadScale))
            self.ui.textbox_maxDisplacement.setText(str(0.001 * loadScale))

        self.setWindowTitle(f"LeoFEA {self.version}")

    def onButton_selectWorkdir(self):

        ret = QtWidgets.QFileDialog.getExistingDirectory(self, 'selectWorkdir', self.workdir)

        self.workdir = ret

        self.textbox_workdir.setText(ret)

    def onButton_selectLDrawModel(self):

        filename = QtWidgets.QFileDialog.getOpenFileName(self, 'Open File', EXAMPLES_DIR)
        ldrFname = filename[0]

        if len(ldrFname)==0:
            QMessageBox.warning(self, "selectLDrawModel", "No filename selected, set to default")
            ldrFname = self.defaultLDrawModelName

        self.textbox_FilenameLDR.setText(ldrFname)
        self._loadLDR()

    def onButton_loadLDrawModel(self):

        self._loadLDR()

    def onButton_startFEA(self):

        try:

            self._loadLDR()    # Load LDR file

            # Adjust table widget for part info and force definition
            self.ui.tableWidgetLDR.setSizeAdjustPolicy(QtWidgets.QAbstractScrollArea.AdjustToContents)
            self.ui.tableWidgetLDR.resizeColumnsToContents()

            # Init output
            self.ui.textEdit_resultsMinForce.setText('')
            self.ui.textEdit_resultsMaxForce.setText('')
            self.ui.textEdit_resultsMinDisplacement.setText('')
            self.ui.textEdit_resultsMaxDisplacement.setText('')

            self.ui.textEdit_resultsMinForce_p.setText('')
            self.ui.textEdit_resultsMaxForce_p.setText('')
            self.ui.textEdit_resultsMinDisplacement_p.setText('')
            self.ui.textEdit_resultsMaxDisplacement_p.setText('')

            caddrive.http.leoFEA(self.textbox_FilenameLDR.text(), OUT_DIR, JOB_NAME)
            
        except Exception as e:

            QMessageBox.warning(self, "startFEA", f"{e}")

    def onButton_viewPNG(self):

        # View Bitmap result
        dialog = QtWidgets.QDialog()

        pixmap = QtGui.QPixmap(os.path.join(OUT_DIR, f"{JOB_NAME}.png"))

        label = QtWidgets.QLabel()
        label.setPixmap(pixmap)

        layout = QtWidgets.QVBoxLayout(dialog)
        layout.addWidget(label)
        
        dialog.exec_()

    def onButton_checkLimitValues(self):

        QMessageBox.about(self, "ChecklimitValues", "Function not yet implemented")

    def onButton_openLeoCAD(self):

        QMessageBox.about(self, "openLeoCAD", "Function not yet implemented")

    def onButton_openParaView(self):

        QMessageBox.about(self, "openParaview", "Function not yet implemented")

    def _loadLDR(self):

        # Print information as table
        parser = caddrive.ldraw.parsers.TableParser()
        self.tableLDR = parser.readFileLDR(self.textbox_FilenameLDR.text())

        #print(self.tableLDR)

        numRows = len(self.tableLDR)
        if numRows > 0:
            numCols = len(self.tableLDR[0]) + 3     # three additional columns for force definition

        if numRows*numCols:   # If not zero
            self.ui.tableWidgetLDR.setRowCount(numRows)
            self.ui.tableWidgetLDR.setColumnCount(numCols)
        else:
            QMessageBox.about(self, "Error reading LDR", f"Dimension of table is zero: numRows={numRows}, numCols={numCols}")
            return

        self.ui.tableWidgetLDR.setHorizontalHeaderLabels(["ID", "dat", "nx", "ny", "nz", "Description", "posx", "posy", "posz", "Fx", "Fy", "Fz"])
        self.ui.tableWidgetLDR.verticalHeader().hide()

        row = 0
        for line in self.tableLDR:
            #[i, datname, dim[0], dim[1], dim[2], dim[3], posx, posy, posz]

            # Round position values to 0.1
            line[6] = round(line[6],1)
            line[7] = round(line[7],1)
            line[8] = round(line[8],1)

            line.append( 0 )
            line.append( 0 )
            line.append( 0 )

            col = 0
            for item in line:
                self.ui.tableWidgetLDR.setItem(row,col, QTableWidgetItem(str(item)))
                col +=1

            row+=1

        self.ui.tableWidgetLDR.resizeColumnsToContents()

        # Display mass
        rho = 4.8e-10
        mass = rho * parser.volume * 1e6    #g

        self.ui.textbox_mass.setText(f"{mass:0.1f}")

        #self.ui.textbox_numberBricks.setText(f"{len(self.tableLDR)}")   # Number of bricks
        self.ui.textbox_numberBricks.setText(f"{parser.numberSegments}")     # Number of segments

        self.ui.textbox_costs.setText(f"{parser.price}")

# Start app

app = QtWidgets.QApplication(sys.argv)

dialog = LeoFEAGUI()
dialog.show()

sys.exit(app.exec_())