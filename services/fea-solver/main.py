from flask import Flask, request, Response
from requests_toolbelt import MultipartEncoder

import os, glob
from pathlib import PureWindowsPath, PurePosixPath
import shutil

app = Flask(__name__)

@app.post("/")
def simulate():

    # Path for simulation model and results

    modelpath = "/work/aster"

    jobname = "job"
  
    # Step 1: Delete temporary files

    cleanModelpath(modelpath)

    # Step 2: Save request files to disk
    
    if "mail" in request.files and "comm" in request.files:
        request.files["mail"].save(f"{modelpath}/{jobname}.mail")
        request.files["comm"].save(f"{modelpath}/{jobname}.comm")
    else:
        return "Request not correct!", 400

    # Step 3: Run job an return multipart response
    
    return runJob(modelpath, jobname)

def cleanModelpath(modelpath):

    delete_files = f"{modelpath}/*"
    for f in glob.glob(delete_files):
        print(f)
        if os.path.isdir(f):
            shutil.rmtree(f)
        else:
            os.remove(f)

def runJob(modelpath: str, jobname: str):

    # Step 1: Generate corresponding export file

    generateExportFile(modelpath, jobname)
      
    # Step 2: Start code_aster simulation
    
    startSimulation(modelpath, jobname)
    
    # Step 3: Return simulation results as string

    fname_resu    = f'{modelpath}/{jobname}.resu'
    fname_message = f'{modelpath}/{jobname}.message'
    fname_rmed    = f'{modelpath}/{jobname}.rmed'
    
    m = MultipartEncoder(
        fields = {
            'resu':    (f'{jobname}.resu',    open(fname_resu, 'rb'),    'text/plain'),
            'message': (f'{jobname}.message', open(fname_message, 'rb'), 'text/plain'),
            'rmed':    (f'{jobname}.rmed',    open(fname_rmed, 'rb'),    'application/octet-stream')
        }
    )

    return Response(m.to_string(), mimetype = m.content_type)
    
def generateExportFile(modelpath: str, jobname: str):

    fname_export = f"{modelpath}/{jobname}.export"

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

def startSimulation(modelpath: str, jobname: str):

    command = f"as_run {modelpath}/{jobname}.export"

    print(command)

    ret = os.system(command)

    print(ret)

    if ret:
        raise NameError("Code_Aster exited with error")
