#! /usr/bin/python3

# External dependencies

import os
import sys

from importlib.resources import as_file

from PyQt5 import QtWidgets, uic
from PyQt5 import QtGui
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *

import xml.etree.cElementTree as ET
import xml.dom.minidom

import pandas as pd

# Internal dependencies

import caddrive

from config import RESOURCES, EXAMPLES_DIR, OUT_DIR, JOB_NAME, PARAVIEW_TEMPLATE, XML_DIALOG_DATA

# Ensure folder

if not os.path.exists(OUT_DIR): os.makedirs(OUT_DIR)

# Class declaration Dialog to open LDR overview
class ViewLDR_UI(QtWidgets.QDialog):

    def __init__(self, parent=None):

        super().__init__(parent)

        self._initUI()

    def _initUI(self):
        
        resDialog = RESOURCES.joinpath('viewLDR.ui')

        with as_file(resDialog) as file:

            self.ui = uic.loadUi(file.absolute(), self)   # Created with QT5 Designer


class LeoFEA_UI(QtWidgets.QDialog):

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

        self.viewLDRdlg = ViewLDR_UI()

        self._initUI()

    def _initUI(self):

        resDialog = RESOURCES.joinpath('dialog.ui')

        with as_file(resDialog) as file:

            self.ui = uic.loadUi(file.absolute(), self)   # Created with QT5 Designer

            # Slots (connect Buttons with methods)
            self.ui.button_SelectPath_LeoCAD.clicked.connect(self._onButton_SelectPath_LeoCAD)
            self.ui.button_SelectPath_Paraview.clicked.connect(self._onButton_SelectPath_Paraview)
            self.ui.button_SelectPath_OutputFEA.clicked.connect(self._onButton_SelectPath_OutputFEA)
            self.ui.button_LoadLDR.clicked.connect(self._onButton_LoadLDR)
            self.ui.button_ViewLDR.clicked.connect(self._onButton_ViewLDR)
            self.ui.button_startFEA.clicked.connect(self._onButton_startFEA)
            self.ui.button_viewPNG.clicked.connect(self._onButton_viewPNG)
            self.ui.button_checkLimitValues.clicked.connect(self._onButton_checkLimitValues)
            self.ui.button_openLeoCAD.clicked.connect(self._onButton_openLeoCAD)
            self.ui.button_openParaview.clicked.connect(self._onButton_openParaView)

            # Initialize Combobox
            self.ui.combo_Analysis.addItem('Static');     self.comboAnalysisIndex_Static  = 0
            self.ui.combo_Analysis.addItem('Modal');      self.comboAnalysisIndex_Modal   = 1
            self.ui.combo_Analysis.addItem('Dynamic');    self.comboAnalysisIndex_Dynamic = 2
            self.ui.combo_Analysis.addItem('Damage');     self.comboAnalysisIndex_Damage  = 3

            self.ui.combo_Contact.addItem('Off');         self.comboContactIndex_Off = 0
            self.ui.combo_Contact.addItem('On');          self.comboContactIndex_On  = 1

            # Initialize textboxes
            self.ui.textbox_jobname.setText("caddrive")
            self.ui.textbox_FilenameLDR.setText(self.defaultLDrawModelName)
            self.ui.textbox_workdir.setText(self.workdir)

            loadScale = 100

            self.ui.textbox_gravityScale.setText(str(loadScale))
            self.ui.textbox_maxForce.setText(str(0.1 * loadScale))
            self.ui.textbox_maxDisplacement.setText(str(0.001 * loadScale))

            self._LoadDialogData()

        self.setWindowTitle(f"LeoFEA {self.version}")

    def _SaveDialogData(self):

        m_encoding = 'UTF-8'

        root = ET.Element("root")
        ET.SubElement(root, "path_leoCAD").text = self.ui.textbox_path_leoCAD.text()
        ET.SubElement(root, "path_paraview").text = self.ui.textbox_path_paraview.text()

        dom = xml.dom.minidom.parseString(ET.tostring(root))
        xml_string = dom.toprettyxml()
        part1, part2 = xml_string.split('?>')

        userpath = os.path.expanduser('~')
        with open(f"{userpath}/{XML_DIALOG_DATA}", 'w') as xfile:
            xfile.write(part1 + 'encoding=\"{}\"?>\n'.format(m_encoding) + part2)
            xfile.close()
        # TODO save state in User directory
        
    def _LoadDialogData(self):
        
        userpath = os.path.expanduser('~')

        

        try:
            tree = ET.parse(f"{userpath}/{XML_DIALOG_DATA}")
            root = tree.getroot()

            pathLeoCAD = root.find("path_leoCAD").text
            pathparaview = root.find("path_paraview").text

            print(f"Path found: {pathLeoCAD}")
            print(f"Path found: {pathparaview}")
            
            self.ui.textbox_path_leoCAD.setText( root.find("path_leoCAD").text )
            self.ui.textbox_path_paraview.setText( root.find("path_paraview").text )

        except FileNotFoundError:

            QMessageBox.warning(self, "Dialog Data missing", "Dialog data not found, using default settings")


    def _onButton_SelectPath_LeoCAD(self):

        ret = QtWidgets.QFileDialog.getExistingDirectory(self, 'Select Path for LeoCAD exe', self.ui.textbox_path_leoCAD.text())

        if ret != '':

            self.ui.textbox_path_leoCAD.setText(ret)

            self._SaveDialogData()

    def _onButton_SelectPath_Paraview(self):

        ret = QtWidgets.QFileDialog.getExistingDirectory(self, 'Select Path for Paraview exe', self.ui.textbox_path_paraview.text())

        if ret != '':
            self.ui.textbox_path_paraview.setText(ret)

            self._SaveDialogData()

    def _onButton_SelectPath_OutputFEA(self):

        ret = QtWidgets.QFileDialog.getExistingDirectory(self, 'Select FEA output directory', self.workdir)

        if ret != '':
            self.workdir = ret

            self.ui.textbox_workdir.setText(ret)

            self._SaveDialogData()

    def _onButton_LoadLDR(self):

        filename = QtWidgets.QFileDialog.getOpenFileName(self, 'Open File', EXAMPLES_DIR)
        ldrFname = filename[0]

        if len(ldrFname)==0:
            QMessageBox.warning(self, "selectLDrawModel", "No filename selected, set to default")
            ldrFname = self.defaultLDrawModelName

        self.ui.textbox_FilenameLDR.setText(ldrFname)
        self._loadLDR()

    def _onButton_ViewLDR(self):

        self._loadLDR()

        self.viewLDRdlg.ui.textbox_FilenameLDR.setText(self.ui.textbox_FilenameLDR.text() )
 
        self.viewLDRdlg.show()

    def _onButton_startFEA(self):

        #try:

            self._loadLDR()    # Load LDR file

            # Adjust table widget for part info and force definition
            self.viewLDRdlg.ui.tableWidgetLDR.setSizeAdjustPolicy(QtWidgets.QAbstractScrollArea.AdjustToContents)
            self.viewLDRdlg.ui.tableWidgetLDR.resizeColumnsToContents()

            # Init output
            self.ui.textEdit_resultsMinForce.setText('')
            self.ui.textEdit_resultsMaxForce.setText('')
            self.ui.textEdit_resultsMinDisplacement.setText('')
            self.ui.textEdit_resultsMaxDisplacement.setText('')

            self.ui.textEdit_resultsMinForce_p.setText('')
            self.ui.textEdit_resultsMaxForce_p.setText('')
            self.ui.textEdit_resultsMinDisplacement_p.setText('')
            self.ui.textEdit_resultsMaxDisplacement_p.setText('')

            #caddrive.http.leoFEA(self.textbox_FilenameLDR.text(), OUT_DIR, JOB_NAME)

            # Read results for max values
            df = pd.read_feather(f"{OUT_DIR}/{JOB_NAME}.resMinMax.feather")  
            print(df)
            depl3_min = float( df[ df['DESCRIPTION']== 'DEPL3_MIN']['VALUE'] )
            depl3_max = float( df[ df['DESCRIPTION']== 'DEPL3_MAX']['VALUE'] )
            forc3_min = float( df[ df['DESCRIPTION']== 'FORC3_MIN']['VALUE'] )
            forc3_max = float( df[ df['DESCRIPTION']== 'FORC3_MAX']['VALUE'] )

            depl3_min_x = float( df[ df['DESCRIPTION']== 'DEPL3_MIN']['COOR1'] )
            depl3_max_x = float( df[ df['DESCRIPTION']== 'DEPL3_MAX']['COOR1'] )
            forc3_min_x = float( df[ df['DESCRIPTION']== 'FORC3_MIN']['COOR1'] )
            forc3_max_x = float( df[ df['DESCRIPTION']== 'FORC3_MAX']['COOR1'] )

            depl3_min_y = float( df[ df['DESCRIPTION']== 'DEPL3_MIN']['COOR2'] )
            depl3_max_y = float( df[ df['DESCRIPTION']== 'DEPL3_MAX']['COOR2'] )
            forc3_min_y = float( df[ df['DESCRIPTION']== 'FORC3_MIN']['COOR2'] )
            forc3_max_y = float( df[ df['DESCRIPTION']== 'FORC3_MAX']['COOR2'] )

            depl3_min_z = float( df[ df['DESCRIPTION']== 'DEPL3_MIN']['COOR3'] )
            depl3_max_z = float( df[ df['DESCRIPTION']== 'DEPL3_MAX']['COOR3'] )
            forc3_min_z = float( df[ df['DESCRIPTION']== 'FORC3_MIN']['COOR3'] )
            forc3_max_z = float( df[ df['DESCRIPTION']== 'FORC3_MAX']['COOR3'] )

            self.ui.textEdit_resultsMinForce.setText(f'{forc3_min:.1f}')
            self.ui.textEdit_resultsMaxForce.setText(f'{forc3_max:.1f}')
            self.ui.textEdit_resultsMinDisplacement.setText(f'{depl3_min:.1f}')
            self.ui.textEdit_resultsMaxDisplacement.setText(f'{depl3_max:.1f}')

            self.ui.textEdit_resultsMinForce_p.setText(f'[{forc3_min_x}, {forc3_min_y}, {forc3_min_z}]')
            self.ui.textEdit_resultsMaxForce_p.setText(f'[{forc3_max_x}, {forc3_max_y}, {forc3_max_z}]')
            self.ui.textEdit_resultsMinDisplacement_p.setText(f'[{depl3_min_x}, {depl3_min_y}, {depl3_min_z}]')
            self.ui.textEdit_resultsMaxDisplacement_p.setText(f'[{depl3_max_x}, {depl3_max_y}, {depl3_max_z}]')
            
        #except Exception as e:

        #    QMessageBox.warning(self, "startFEA", f"{e}")

    def _onButton_viewPNG(self):

        # View Bitmap result
        dialog = QtWidgets.QDialog()

        pixmap = QtGui.QPixmap(os.path.join(OUT_DIR, f"{JOB_NAME}.png"))

        label = QtWidgets.QLabel()
        label.setPixmap(pixmap)

        layout = QtWidgets.QVBoxLayout(dialog)
        layout.addWidget(label)
        
        dialog.exec_()

    def _onButton_checkLimitValues(self):

        QMessageBox.about(self, "ChecklimitValues", "Function not yet implemented")

    def _onButton_openLeoCAD(self):

        commandLeoCAD = f"START {self.ui.textbox_path_leoCAD.text()}\leoCAD.exe"

        os.system(commandLeoCAD)

    def _onButton_openParaView(self):
        
        # Write postProcessParaviewFile
        templateParaview = f'{RESOURCES}/{PARAVIEW_TEMPLATE}'
     
        ftemp = open(templateParaview, 'r') # Open template file

        fnamePost = f'{OUT_DIR}/pv_job.py'     # Postprocessing file
        fpost = open(fnamePost, 'w')
     
        #Write information to postprocessing file
        fpost.write(f"jobname = '{JOB_NAME}'\n")
        fpost.write(f"filename = r'{OUT_DIR}/{JOB_NAME}'\n")
        timeVisualization = 1
        fpost.write(f"timeVisualization = {timeVisualization}\n")
        fpost.write('\n')

        # Append template file
        for line in ftemp:
            fpost.write(line)

        ftemp.close()
        fpost.close()

        # Start Paraview
        paraviewCommand = f'{self.ui.textbox_path_paraview.text()}/paraview.exe --script="{fnamePost}"'
        os.system(paraviewCommand)

    def _loadLDR(self):

        # Print information as table
        parser = caddrive.ldraw.parsers.TableParser()
        self.tableLDR = parser.readFileLDR(self.textbox_FilenameLDR.text())

        #print(self.tableLDR)

        numRows = len(self.tableLDR)
        if numRows > 0:
            numCols = len(self.tableLDR[0]) #+ 3     # three additional columns for force definition

        if numRows*numCols:   # If not zero
            self.viewLDRdlg.ui.tableWidgetLDR.setRowCount(numRows)
            self.viewLDRdlg.ui.tableWidgetLDR.setColumnCount(numCols)
        else:
            QMessageBox.about(self, "Error reading LDR", f"Dimension of table is zero: numRows={numRows}, numCols={numCols}")
            return

        self.viewLDRdlg.ui.tableWidgetLDR.setHorizontalHeaderLabels(["ID", "dat", "nx", "ny", "nz", "Description", "posx", "posy", "posz"]) #, "Fx", "Fy", "Fz"])
        self.viewLDRdlg.ui.tableWidgetLDR.verticalHeader().hide()

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
                self.viewLDRdlg.ui.tableWidgetLDR.setItem(row,col, QTableWidgetItem(str(item)))
                col +=1

            row+=1

        self.viewLDRdlg.ui.tableWidgetLDR.resizeColumnsToContents()

        # Display mass
        rho = 4.8e-10
        mass = rho * parser.volume * 1e6    #g

        self.ui.textbox_mass.setText(f"{mass:0.1f}")

        self.ui.textbox_numberParts.setText(f"{len(self.tableLDR)}")           # Number of bricks
        self.ui.textbox_numberSegments.setText(f"{parser.numberSegments}")     # Number of segments

        self.ui.textbox_costs.setText(f"{parser.price}")

# Start app

app = QtWidgets.QApplication(sys.argv)

dialog = LeoFEA_UI()
dialog.show()

sys.exit(app.exec_())