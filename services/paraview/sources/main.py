import os

from flask import Flask, request, send_file

from config import *
    
# Ensure folder
if not os.path.exists(OUTPUTS_DIR): os.makedirs(OUTPUTS_DIR)

# Create app
APP = Flask(__name__)

# Register route
@APP.post("/")
def render():
    
    # Check request
    if not "rmed" in request.files:
        return "Rmed file is missing!", 400

    # Save rmed file
    request.files["rmed"].save(f"{OUTPUTS_DIR}/{JOB_NAME}.rmed")
    
    # Define visualization timepoint
    timeVisualization = 1

    # Open template file
    fTemplate = open(PARAVIEW_RES, 'r')

    # Define job filename
    fNameJob = f'{OUTPUTS_DIR}/{JOB_NAME}.py'
    
    # Open job file
    fJob = open(fNameJob, 'w')

    #Write information to postprocessing file
    fJob.write(f"jobname = '{JOB_NAME}'\n")
    fJob.write(f"filename = r'{OUTPUTS_DIR}/{JOB_NAME}'\n")
    fJob.write(f"timeVisualization = {timeVisualization}\n")
    fJob.write('\n')

    # Append template file
    for line in fTemplate:
        fJob.write(line)

    # Close template file
    fTemplate.close()

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
        return send_file(f'{OUTPUTS_DIR}/{JOB_NAME}.png', 'image/png')

# Run app
APP.run(host=FLASK_HOST, port=FLASK_PORT, debug=FLASK_DBUG)