# External dependencies
import os
import sys

from flask import Flask

# Ensure folder
if not os.path.exists("./output"): 
    os.makedirs("./output")

# Define constants
FLASK_HOST = "0.0.0.0"
FLASK_PORT = 5000
FLASK_DBUG = sys.argv.count("--debug") > 0

OPENFOAM_MSH_CMD = "blockMesh"
OPENFOAM_ICO_CMD = "icoFoam"

WORKDIR = "./output"
JOBNAME = "job"

# Create app
APP = Flask(__name__)

# Register route
@APP.post("/")
def simulate():

    # Command to mesh the body
    ret = os.system(f"{OPENFOAM_MSH_CMD}")

    # Handle error
    if ret:
        return "blockMesh error", 400

    # Command to start the simulation
    ret = os.system(f"{OPENFOAM_ICO_CMD}")

    # Handle error
    if ret:
        return "icoFaom error", 400
    
    # Send response
    return "OK"

# Run app
APP.run(host=FLASK_HOST, port=FLASK_PORT, debug=FLASK_DBUG)