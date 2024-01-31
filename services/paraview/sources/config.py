import sys

FLASK_HOST = "0.0.0.0"
FLASK_PORT = 5000
FLASK_DBUG = sys.argv.count("--debug") > 0

RESOURCES_DIR = "../resources"
OUTPUTS_DIR = "../outputs"

PARAVIEW_CMD = "/opt/paraview/bin/pvpython"
PARAVIEW_RES = f"{RESOURCES_DIR}/templatePostProcessParaviewLinux.py"

JOB_NAME = "job"