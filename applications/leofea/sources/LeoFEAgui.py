#! /usr/bin/python3


# External dependencies
import os
import sys
from timeit import default_timer as timer
import platform

from flask import Flask, request, Response, send_file
from requests import post
from requests_toolbelt import MultipartEncoder, MultipartDecoder

from PyQt5 import QtWidgets, uic
from PyQt5.QtCore import QAbstractTableModel, Qt, QModelIndex
from PyQt5.QtGui import QIcon
#from PyQt5.QtWidgets import QMessageBox, QTableWidget
from PyQt5.QtWidgets import *

# Internal dependencies
from config import *
sys.path.append(f'{SOURCES_LEOFEA_DIR}')
import leoFeaModelDescription

# Ensure folder
if not os.path.exists(OUTPUTS_DIR): os.makedirs(OUTPUTS_DIR)

class myDialog(QtWidgets.QDialog):

    def __init__(self, parent=None):
        super().__init__(parent)

        self.version = "6.5.1"

        self.tableLDR = []

        self.fileNameMainDialog = f"{RESOURCES_DIR}/mainDialog.ui"
        self.fileNameIcon = "{RESOURCES_DIR}/iconLeoCAD1.png"

        self.resultsMinForce = [ 0, [0,0,0]]
        self.resultsMaxForce = [ 0, [0,0,0]]
        self.resultsMinDispl = [ 0, [0,0,0]]
        self.resultsMaxDispl = [ 0, [0,0,0]]

        systemName = platform.system()
        if systemName == 'Linux':
            self.commandLeoCAD = f"{COMMAND_START_LEOCAD_LINUX}"
            self.workdir = f"{OUTPUTS_DIR}"                                                       
            self.defaultLDRname = f"{LEOCADMODELS_DIR}/CADdrive.ldr"                          
        elif systemName == 'Windows':
            self.workdir = f"{OUTPUTS_DIR}"                                                                        
            self.commandLeoCAD = f"{COMMAND_START_LEOCAD_WIN}"                                                     
            self.defaultLDRname = f"{LEOCADMODELS_DIR}/CADdrive.ldr"
        else:
            raise NameError('Only implemented for Linux and Windows')

        self.initUI()

    def initUI(self):
        self.ui = uic.loadUi(self.fileNameMainDialog, self)   # Created with QT5 Designer
        self.setWindowIcon(QIcon(self.fileNameIcon))
        self.setWindowTitle(f"LeoFEA {self.version}")

        # Slots (connect Buttons with methods)
        self.ui.button_openLeoCAD.clicked.connect(self.onButton_openLeoCAD)
        self.ui.button_SelectLDR.clicked.connect(self.onButton_SelectLDR)
        self.ui.button_SelectWorkdir.clicked.connect(self.onButton_SelectWorkdir)
        self.ui.button_LoadLDR.clicked.connect(self.onButton_LoadLDR)
        self.ui.button_startFEA.clicked.connect(self.onButton_startFEA)
        self.ui.button_checkLimitValues.clicked.connect(self.onButton_checkLimitValues)

        # Initialize Combobox
        self.ui.combo_Analysis.addItem('Static');     self.comboIndexStatic = 0
        self.ui.combo_Analysis.addItem('Modal');      self.comboIndexModal = 1
        self.ui.combo_Analysis.addItem('Dynamic');    self.comboIndexDynamic = 2
        self.ui.combo_Analysis.addItem('Damage');     self.comboIndexDamage = 3

        # Initialize textboxes
        self.ui.textbox_jobname.setText("caddrive")
        self.ui.textbox_FilenameLDR.setText(self.defaultLDRname)
        self.ui.textbox_workdir.setText(self.workdir)

        loadScale = 100
        self.ui.textbox_gravityScale.setText(str(loadScale))
        self.ui.textbox_maxForce.setText(str(0.1 * loadScale))
        self.ui.textbox_maxDisplacement.setText(str(0.001 * loadScale))



    def onButton_openLeoCAD(self):
        os.system(self.commandLeoCAD)           # TODO a ldr file in Leocad (send request to LeoCAD)

    def onButton_LoadLDR(self):
        self.loadLDR()

    def onButton_SelectLDR(self):
        filename = QtWidgets.QFileDialog.getOpenFileName(self, 'Open File', f"{LEOCADMODELS_DIR}")
        ldrFname = filename[0]

        if len(ldrFname)==0:
            QMessageBox.about(self, "Title", "No filename selected, set to default")
            ldrFname = self.defaultLDRname

        self.textbox_FilenameLDR.setText(ldrFname)
        self.loadLDR()

    def onButton_SelectWorkdir(self):
        ret = QtWidgets.QFileDialog.getExistingDirectory(self, 'Select directory', self.workdir)
        self.workdir = ret
        self.textbox_workdir.setText(ret)


    def onButton_checkLimitValues(self):
        self.checkLimitValues()

    def loadLDR(self):
        # Print information as table
        lD = leoFeaModelDescription.leoFeaModelDescription()
        self.tableLDR = lD.readFileLDR(FILENAME_LIB_LDR, self.textbox_FilenameLDR.text() )

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
        #rho = 1.04e-09 * 0.6
        rho = 4.8e-10
        mass = rho * lD.volume * 1e6    #g

        self.ui.textbox_mass.setText(f"{mass:0.1f}")

        #self.ui.textbox_numberBricks.setText(f"{len(self.tableLDR)}")   # Number of bricks
        self.ui.textbox_numberBricks.setText(f"{lD.numberSegments}")     # Number of segments

        self.ui.textbox_costs.setText(f"{lD.price}")


    def onButton_startFEA(self):

        job = self.ui.textbox_jobname.text()           # Get jobname
        ldrFile = self.ui.textbox_FilenameLDR.text()   # Get name of LDR file

        self.loadLDR()    # Load LDR file

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

        tStart = timer()

        # Send ldr file to sevice leoFEA
        reqDataA = MultipartEncoder(
            fields = {
                "lib": (f'{JOB_NAME}.lib', open(FILENAME_LIB_LDR, 'rb'), 'text/plain'),
                "ldr": (f'{JOB_NAME}.ldr', open(self.textbox_FilenameLDR.text(), 'rb'), 'text/plain')
            }
        )
        resA = post("http://leofea:5000/", data = reqDataA, 
            headers = {
                "Content-Type": reqDataA.content_type
            }   
        )

        # Check for errors
        if resA.status_code != 200:
            return "CodeAster error", 400

        # Part multipart response
        resDataA = MultipartDecoder.from_response(resA)

        # Check for errors
        if len(resDataA.parts) != 3:
            return "CodeAster error", 400

        if 0: # TODO: Model adpations, postprocessing ....
            # Scale Gravity
            lego.gravityScale = float(self.ui.textbox_gravityScale.text())                        # TODO
            lego.maxNubForce = float(self.ui.textbox_maxForce.text())                             # TODO
            lego.maxDisplacement = float(self.ui.textbox_maxDisplacement.text())                  # TODO

            #QMessageBox.about(self, "Title", f"{lego.numParts}")

            lego.readLDR( ldrFile )

            if self.ui.checkBox_contact.isChecked():     # Contact activated
                lego.disable_contact = 0
            else:  # Disable contact, # Disable contact can be necessary (Problem with multiple contact pairs master / slave)
                lego.disable_contact = 1

            # Define dynamic boundary conditions
            if self.ui.checkBox_force:
                print("Body forces:")
                for i in range(lego.numParts):
                    Fx = float(self.ui.tableWidgetLDR.item(i,  9).text() )
                    Fy = float(self.ui.tableWidgetLDR.item(i, 10).text() )
                    Fz = float(self.ui.tableWidgetLDR.item(i, 11).text() )

                    # Magnitude of force
                    F = (Fx*Fx + Fy*Fy + Fz*Fz)**(0.5)
                    #print([i, Fx, Fy, Fz, F])

                    if F > 0.00001:
                        print([i, Fx, Fy, Fz, F])
                        lego.addForceDistributeVolume(i, Fx, Fy, Fz)

            #lastPid = lego.numParts-1
            #lego.addForceDistribureSurface(lastPid, 'TOP', -0.1)

            if self.ui.checkBox_CodeAster.isChecked():
                lego.startSim = 1
            else:
                lego.startSim = 0   # Debut mode without starting simulation (only pre- and postprocessing)
                #QMessageBox.about(self, "", "Warning, no CodeAster Run")

            try:
                if self.ui.combo_Analysis.currentIndex() == self.comboIndexStatic:   # STATIC ANALYSIS
                    lego.simulateStatic()
                elif self.ui.combo_Analysis.currentIndex() == self.comboIndexModal:   # MODAL ANALYSIS
                    lego.simulateModal()
                    #QMessageBox.about(self, "TODO Error", "Run Modal Analyis")
                    #return
                elif self.ui.combo_Analysis.currentIndex() == self.comboIndexDynamic:   # DYNAMIC ANALYSIS
                    lego.simulateDynamic()
                elif self.ui.combo_Analysis.currentIndex() == self.comboIndexDamage:   # DAMAGE ANALYSIS
                    QMessageBox.about(self, "TODO Error", "Run Damage Analyis")
                    return
            except:
                QMessageBox.about(self, "Simulation Error", "Seemingly, some bricks are not fixed")
                return




            # Postprocess Paraview
            if self.ui.checkBox_OpenParaview.isChecked():
                lego.visualizeParaviewStatic()

            tEnd = timer()

            print(f"Total time of analysis: {tEnd-tStart:.2f}s\n")
            #QMessageBox.about(self, "Title", f"Simulation Done")

            # OUTPUT
            if self.ui.combo_Analysis.currentIndex() == self.comboIndexStatic:   # STATIC ANALYSIS
                # Get values
                self.resultsMinForce = lego.resultsMinForce
                self.resultsMaxForce = lego.resultsMaxForce
                self.resultsMinDispl = lego.resultsMinDispl
                self.resultsMaxDispl = lego.resultsMaxDispl

                # Display resutls in textEdit_results
                self.ui.textEdit_resultsMinForce.setText(f'{lego.resultsMinForce[0]:.1f}')
                self.ui.textEdit_resultsMaxForce.setText(f'{lego.resultsMaxForce[0]:.1f}')
                self.ui.textEdit_resultsMinDisplacement.setText(f'{lego.resultsMinDispl[0]:.1f}')
                self.ui.textEdit_resultsMaxDisplacement.setText(f'{lego.resultsMaxDispl[0]:.1f}')

                self.ui.textEdit_resultsMinForce_p.setText(f'{lego.resultsMinForce[1]}')
                self.ui.textEdit_resultsMaxForce_p.setText(f'{lego.resultsMaxForce[1]}')
                self.ui.textEdit_resultsMinDisplacement_p.setText(f'{lego.resultsMinDispl[1]}')
                self.ui.textEdit_resultsMaxDisplacement_p.setText(f'{lego.resultsMaxDispl[1]}')

                self.checkLimitValues()

    def checkLimitValues(self):

        maxNubForce = float(self.ui.textbox_maxForce.text())
        maxDisplacement = float(self.ui.textbox_maxDisplacement.text())

        if self.resultsMinForce[0] < -1*maxNubForce:
            self.ui.textEdit_resultsMinForce_m.setText(f'!!! Overloaded')
        else:
            self.ui.textEdit_resultsMinForce_m.setText(f'')

        #if self.resultsMaxForce[0] > maxNubForce:
        #    self.ui.textEdit_resultsMaxForce_m.setText(f'!!! Overloaded')
        #else:
        self.ui.textEdit_resultsMaxForce_m.setText(f'')

        if self.resultsMinDispl[0] < -1*maxDisplacement:
            self.ui.textEdit_resultsMinDisplacement_m.setText(f'!!! Overloaded')
        else:
                self.ui.textEdit_resultsMinDisplacement_m.setText(f'')

        if self.resultsMaxDispl[0] > maxDisplacement:
            self.ui.textEdit_resultsMaxDisplacement_m.setText(f'!!! Overloaded')
        else:
            self.ui.textEdit_resultsMaxDisplacement_m.setText(f'')

# Start app
app = QtWidgets.QApplication(sys.argv)
dialog = myDialog()
dialog.show()
sys.exit(app.exec_())
