import os.path

from importlib.resources import files

RESOURCES = files("resources")

SRC_DIR = os.path.dirname(__file__)

OUT_DIR = os.path.join(SRC_DIR, "..", "out")

EXAMPLES_DIR = os.path.join(SRC_DIR, "..", "..", "..", "examples")

JOB_NAME = "job"

PARAVIEW_TEMPLATE = "templateParaviewWin.py"

XML_DIALOG_DATA = "caddriveDialogData.xml"

XML_SIMULATION_SETTINGS = "simulation_settings.xml"