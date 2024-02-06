import os
import sys

from importlib.resources import files

import resources

FLASK_HOST = "0.0.0.0"
FLASK_PORT = 5000
FLASK_DBUG = sys.argv.count("--debug") > 0

SRC_DIR = os.path.dirname(__file__)
OUT_DIR = os.path.join(os.sep, "out")

RESOURCES = files(resources)

PARAVIEW_CMD = "/opt/paraview/bin/pvpython"
PARAVIEW_RES = RESOURCES.joinpath("template.py")

JOB_NAME = "job"