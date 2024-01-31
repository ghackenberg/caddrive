import sys

FLASK_HOST = "0.0.0.0"
FLASK_PORT = 5000
FLASK_DBUG = sys.argv.count("--debug") > 0

RESOURCES_DIR = "../resources"
OUTPUTS_DIR = "../outputs"

OPENFOAM_MESH_CMD = "blockMesh"
OPENFOAM_FOAM_CMD = "icoFoam"

JOB_NAME = "job"