from flask import Flask, request, Response
from requests_toolbelt import MultipartEncoder

import os, glob
from pathlib import PureWindowsPath, PurePosixPath
import shutil

app = Flask(__name__)

@app.post("/")
def simulate():

    # Command to mesh the body
    ret = os.system("blockMesh")

    print(ret)

    if ret:
        raise NameError("Code_Aster exited with error")
    

    # Command to start the simulation
    ret = os.system("icoFoam")

    print(ret)

    if ret:
        raise NameError("Code_Aster exited with error")