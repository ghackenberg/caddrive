import os

from flask import Flask

from config import *

# Ensure folder
if not os.path.exists(OUT_DIR): os.makedirs(OUT_DIR)

# Create app
APP = Flask(__name__)

# Register route
@APP.post("/")
def simulate():

    # Command to mesh the body
    ret = os.system(f"{OPENFOAM_MESH_CMD}")

    # Handle error
    if ret:
        return "blockMesh error", 400

    # Command to start the simulation
    ret = os.system(f"{OPENFOAM_FOAM_CMD}")

    # Handle error
    if ret:
        return "icoFaom error", 400
    
    # Send response
    return "OK"

# Run app
APP.run(host=FLASK_HOST, port=FLASK_PORT, debug=FLASK_DEBUG)