from flask import Flask, request, send_file

import os

# Define paraview path
FNAME_PARAVIEW = "/opt/paraview/bin/pvpython"
# Define template path
FNAME_TEMPLATE = "./resources/templatePostProcessParaviewLinux.py"

app = Flask(__name__)

@app.post("/")
def leoFeaPostprocessingParaview():
    
    # Check request
    if not "rmed" in request.files:
        return "Rmed file is missing!", 400
    
    # Prepare output
    if not os.path.exists("./output"): 
        os.makedirs("./output")

    # Define jobname
    jobname = "job"

    # Save rmed file
    request.files["rmed"].save(f"./output/{jobname}.rmed")
    
    # Define visualization timepoint
    timeVisualization = 1

    # Open template file
    fTemplate = open(FNAME_TEMPLATE, 'r')

    # Define job filename
    fNameJob = f'./output/{jobname}.py'
    
    # Open job file
    fJob = open(fNameJob, 'w')

    #Write information to postprocessing file
    fJob.write(f"jobname = '{jobname}'\n")
    fJob.write(f"filename = r'./output/{jobname}'\n")
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
    command = f"{FNAME_PARAVIEW} {fNameJob}"

    # Debug paraview command
    print(command)

    # Execute paraview command
    ret = os.system(command)

    # Debug paraview result
    print(ret)

    # Construct multipart response
    return send_file(f'./output/{jobname}.png', 'image/png')
