# External dependencies
import os
import sys

from flask import Flask, request, Response
from requests_toolbelt import MultipartEncoder

# Ensure folder
if not os.path.exists("./output"): 
    os.makedirs("./output")

# Define constants
FLASK_HOST = "0.0.0.0"
FLASK_PORT = 5000
FLASK_DBUG = sys.argv.count("--debug") > 0

CODEASTER_CMD = "as_run"

WORKDIR = "/app/output"
JOBNAME = "job"

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
    
    request.files["mail"].save(f"{WORKDIR}/{JOBNAME}.mail")
    request.files["comm"].save(f"{WORKDIR}/{JOBNAME}.comm")

    # Step 3: Run job an return multipart response
    
    return runJob(WORKDIR, JOBNAME)

def runJob(workdir: str, jobname: str):

    # Step 1: Generate corresponding export file

    generateExportFile(workdir, jobname)
      
    # Step 2: Start code_aster simulation
    
    ret = startSimulation(workdir, jobname)
    
    # Step 3: Return simulation results as string

    if ret:
        return "CodeAster error", 400
    else:
        fname_resu    = f'{workdir}/{jobname}.resu'
        fname_message = f'{workdir}/{jobname}.message'
        fname_rmed    = f'{workdir}/{jobname}.rmed'
        
        m = MultipartEncoder(
            fields = {
                'resu':    (f'{jobname}.resu',    open(fname_resu, 'rb'),    'text/plain'),
                'message': (f'{jobname}.message', open(fname_message, 'rb'), 'text/plain'),
                'rmed':    (f'{jobname}.rmed',    open(fname_rmed, 'rb'),    'application/octet-stream')
            }
        )

        return Response(m.to_string(), mimetype = m.content_type)
    
def generateExportFile(workdir: str, jobname: str):

    fname_export = f"{workdir}/{jobname}.export"

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
    
    fid.write(f'F comm {jobname}.comm D  1\n')
    fid.write(f'F libr {jobname}.mail D  20\n')
    fid.write(f'F libr {jobname}.med R  21\n')
    fid.write(f'F libr {jobname}.rmed R  3\n')
    fid.write(f'F libr {jobname}.resu R  8\n')
    fid.write(f'F mess {jobname}.message R  6\n')
    fid.write(f'R base base-stage_{jobname} R  0\n')

    fid.close()

def startSimulation(workdir: str, jobname: str):

    command = f"{CODEASTER_CMD} {workdir}/{jobname}.export"

    print(command)

    ret = os.system(command)

    print(ret)

    return ret

# Run app
APP.run(host=FLASK_HOST, port=FLASK_PORT, debug=FLASK_DBUG)