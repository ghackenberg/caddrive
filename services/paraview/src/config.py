import sys
import os.path

from importlib.resources import files

import resources

FLASK_HOST = "0.0.0.0"
FLASK_PORT = 5000
FLASK_DBUG = sys.argv.count("--debug") > 0

SOURCES_DIR = os.path.dirname(__file__)
OUTPUTS_DIR = os.path.join(SOURCES_DIR, "..", "outputs")

RESOURCES = files(resources)

PARAVIEW_CMD = "/opt/paraview/bin/pvpython"
PARAVIEW_RES = RESOURCES.joinpath("template.py")

JOB_NAME = "job"