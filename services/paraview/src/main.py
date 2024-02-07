import os

from flask import Flask, request, send_file

from config import *
    
# Ensure folder
if not os.path.exists(OUT_DIR): os.makedirs(OUT_DIR)

# Create app
APP = Flask(__name__)

# Register route
@APP.post("/")
def render():
    
    # Check request
    if not "rmed" in request.files:
        return "Rmed file is missing!", 400

    # Save rmed file
    request.files["rmed"].save(f"{OUT_DIR}/{JOB_NAME}.rmed")
    
    # Define visualization timepoint
    timeVisualization = 1

    # Open template file
    fTemplate = PARAVIEW_RES.read_text()

    # Define job filename
    fNameJob = f'{OUT_DIR}/{JOB_NAME}.py'
    
    # Open job file
    fJob = open(fNameJob, 'w')

    #Write information to postprocessing file
    fJob.write(f"jobname = '{JOB_NAME}'\n")
    fJob.write(f"filename = r'{OUT_DIR}/{JOB_NAME}'\n")
    fJob.write(f"timeVisualization = {timeVisualization}\n")
    fJob.write('\n')

    # Append template file
    for line in fTemplate.splitlines(keepends=True):
        fJob.write(line)

    # Close job file
    fJob.close()

    # Construct paraview command
    command = f"{PARAVIEW_CMD} {fNameJob}"

    # Debug paraview command
    print(command)

    # Execute paraview command
    ret = os.system(command)

    # Debug paraview result
    print(ret)

    # Construct multipart response
    if ret:
        return "ParaView error", 400
    else:
        return send_file(f'{OUT_DIR}/{JOB_NAME}.png', 'image/png')

# Run app
APP.run(host=FLASK_HOST, port=FLASK_PORT, debug=FLASK_DBUG)