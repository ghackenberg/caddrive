import os

from flask import Flask, request, Response
from requests_toolbelt import MultipartEncoder

from config import *

# Ensure folder
if not os.path.exists(OUTPUTS_DIR): os.makedirs(OUTPUTS_DIR)

# Create app
APP = Flask(__name__)

# Register route
@APP.post("/")
def simulate():

    # Step 1: Validate request
    if not "mail" in request.files:
        return "Mail file is missing!", 400
    if not "comm" in request.files:
        return "Comm file is missing!", 400

    # Step 2: Save request files to disk
    
    request.files["mail"].save(f"{OUTPUTS_DIR}/{JOB_NAME}.mail")
    request.files["comm"].save(f"{OUTPUTS_DIR}/{JOB_NAME}.comm")

    # Step 3: Run job an return multipart response
    
    return runJob(OUTPUTS_DIR, JOB_NAME)

def runJob(outputsDir: str, jobName: str):

    # Step 1: Generate corresponding export file

    generateExportFile(outputsDir, jobName)
      
    # Step 2: Start code_aster simulation
    
    ret = startSimulation(outputsDir, jobName)
    
    # Step 3: Return simulation results as string

    if ret:
        return "CodeAster error", 400
    else:
        fname_resu    = f'{outputsDir}/{jobName}.resu'
        fname_message = f'{outputsDir}/{jobName}.message'
        fname_rmed    = f'{outputsDir}/{jobName}.rmed'
        
        m = MultipartEncoder(
            fields = {
                'resu':    (f'{jobName}.resu',    open(fname_resu, 'rb'),    'text/plain'),
                'message': (f'{jobName}.message', open(fname_message, 'rb'), 'text/plain'),
                'rmed':    (f'{jobName}.rmed',    open(fname_rmed, 'rb'),    'application/octet-stream')
            }
        )

        return Response(m.to_string(), mimetype = m.content_type)
    
def generateExportFile(outputsDir: str, jobName: str):

    fname_export = f"{outputsDir}/{jobName}.export"

    print(f"Writing export file: {fname_export}")
    
    fid = open(fname_export, 'w')
       
    fid.write('P actions make_etude\n')
    fid.write('P consbtc yes\n')
    fid.write('P mem_aster 100\n')
    fid.write('P memjob 524288\n')
    fid.write('P memory_limit 512.0\n')
    fid.write('P mode interactif\n')
    fid.write('P mpi_nbcpu 1\n')
    fid.write('P mpi_nbnoeud 1\n')
    fid.write('P ncpus 1\n')
    fid.write('P origine ASTK 2021.0\n')
    fid.write('P rep_trav /tmp/aster-3bf3ee11d600-interactif_10\n')
    fid.write('P soumbtc yes\n')
    fid.write('P testlist submit ci verification sequential\n')
    fid.write('P time_limit 30.0\n')
    fid.write('P tpsjob 1\n')
    fid.write('P version /aster/aster/share/aster\n')
    fid.write('A memjeveux 64.0\n')
    fid.write('A tpmax 30.0\n')
    
    fid.write('\n')
    
    fid.write(f'F comm {jobName}.comm D  1\n')
    fid.write(f'F libr {jobName}.mail D  20\n')
    fid.write(f'F libr {jobName}.med R  21\n')
    fid.write(f'F libr {jobName}.rmed R  3\n')
    fid.write(f'F libr {jobName}.resu R  8\n')
    fid.write(f'F mess {jobName}.message R  6\n')
    fid.write(f'R base base-stage_{jobName} R  0\n')

    fid.close()

def startSimulation(outputsDir: str, jobName: str):

    command = f"{CODEASTER_CMD} {outputsDir}/{jobName}.export"

    print(command)

    ret = os.system(command)

    print(ret)

    return ret

# Run app
APP.run(host=FLASK_HOST, port=FLASK_PORT, debug=FLASK_DEBUG)