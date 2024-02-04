# External dependencies
import os

from flask import Flask, request, Response, send_file
from requests import post
from requests_toolbelt import MultipartEncoder, MultipartDecoder

# Internal dependencies
import leoFeaModelDescription
import leoFeaGenerateModel
import leoFeaPostProcess

from config import *
    
# Ensure folder
if not os.path.exists(OUTPUTS_DIR): os.makedirs(OUTPUTS_DIR)

# Create app
APP = Flask(__name__)

# Register route
@APP.post("/")
def index():

    # Validate request
    if not "lib" in request.files:
        return "Lib file is missing!", 400
    if not "ldr" in request.files:
        return "Ldr file is missing!", 400

    # Save LDR and LIB file
    request.files["ldr"].save(f"{OUTPUTS_DIR}/{JOB_NAME}.ldr")
    request.files["lib"].save(f"{OUTPUTS_DIR}/{JOB_NAME}.lib")

    ######## PREPROCESSING
    # Read LDR file and get table of lego parts as return
    lM = leoFeaModelDescription.leoFeaModelDescription()
    tableLeoFeaModel = lM.readFileLDR(f"{OUTPUTS_DIR}/{JOB_NAME}.lib", f"{OUTPUTS_DIR}/{JOB_NAME}.ldr")

    # Here modifications could be done, e.g. disconnect nodes in case of damage
    lGM = leoFeaGenerateModel.leoFeaGenerateModel(JOB_NAME)
    lGM.buildLeoFeaModel(tableLeoFeaModel)
    lGM.writeInputFiles()

    ######## SOLVER
    # Send mail and comm files to CodeAster and receive simulation results
    reqDataA = MultipartEncoder(
        fields = {
            "mail": (f'{JOB_NAME}.mail', open(f'{OUTPUTS_DIR}/{JOB_NAME}.mail', 'rb'), 'text/plain'),
            "comm": (f'{JOB_NAME}.comm', open(f'{OUTPUTS_DIR}/{JOB_NAME}.comm', 'rb'), 'text/plain')
        }
    )
    resA = post("http://codeaster:5000/", data = reqDataA, headers = {
        "Content-Type": reqDataA.content_type
    })

    # Check for errors
    if resA.status_code != 200:
        return "CodeAster error", 400

    # Part multipart response
    resDataA = MultipartDecoder.from_response(resA)

    # Check for errors
    if len(resDataA.parts) != 3:
        return "CodeAster error", 400
    
    # TODO Make robust against changes in order!
    with open(f"{OUTPUTS_DIR}/{JOB_NAME}.resu", "wb") as file:
        file.write(resDataA.parts[0].content)
    with open(f"{OUTPUTS_DIR}/{JOB_NAME}.message", "wb") as file:
        file.write(resDataA.parts[1].content)
    with open(f"{OUTPUTS_DIR}/{JOB_NAME}.rmed", "wb") as file:
        file.write(resDataA.parts[2].content)


    ######### POSTPROCESSING PARAVIEW
    # Send rmed file to ParaView and receive rendered image
    reqDataB = MultipartEncoder(
        fields = {
            "rmed": (f'{JOB_NAME}.rmed', open(f'{OUTPUTS_DIR}/{JOB_NAME}.rmed', 'rb'), 'text/plain')
        }
    )
    resB = post("http://paraview:5000/", data = reqDataB, headers = {
        "Content-Type": reqDataB.content_type
    })

    # Check for errors
    if resB.status_code != 200:
        return "ParaView error", 400

    # Save parts to output folder
    with open(f"{OUTPUTS_DIR}/{JOB_NAME}.png", "wb") as file:
        file.write(resB.content)


    ######### POSTPROCESSING text files
    lP =  leoFeaPostProcess.leoFeaPostProcess(JOB_NAME)
    lP.postProcessStatic()


    # Return results files
    m = MultipartEncoder(
        fields = {
            'resMinMax': (f'{JOB_NAME}.resMinMax.feather', open(f'{OUTPUTS_DIR}/{JOB_NAME}.resMinMax.feather', 'rb'), 'application/octet-stream'),
            'png': (f'{JOB_NAME}.png', open(f'{OUTPUTS_DIR}/{JOB_NAME}.png', 'rb'), 'text/plain'),
            'rmed': (f'{JOB_NAME}.rmed', open(f'{OUTPUTS_DIR}/{JOB_NAME}.rmed', 'rb'), 'text/plain')
            #'comm': (f'{jobname}.comm', open(f'{OUTPUTS_DIR}/{JOB_NAME}.comm', 'rb'), 'text/plain')
            # TODO simulation time
            # TODO pd_DeplNoda if requested
            # TODO pd_ForcNoda if requested
        }
    )

    return Response(m.to_string(), mimetype = m.content_type)
    
    # Return rendered image
    #return send_file(f"{OUTPUTS_DIR}/{JOB_NAME}.png")

# Register app route
@APP.post("/preprocess")
def preprocess():                                                                                               #TBD: Ist Code-Vervielfachung gut?

    # Validate request
    if not "lib" in request.files:
        return "Lib file is missing!", 400
    if not "ldr" in request.files:
        return "Ldr file is missing!", 400

    # Save LDR and LIB file
    request.files["ldr"].save(f"{OUTPUTS_DIR}/{JOB_NAME}.ldr")
    request.files["lib"].save(f"{OUTPUTS_DIR}/{JOB_NAME}.lib")

    # Read LDR file and get table of lego parts as return
    lM = leoFeaModelDescription.leoFeaModelDescription()
    tableLeoFeaModel = lM.readFileLDR(f"{OUTPUTS_DIR}/{JOB_NAME}.lib", f"{OUTPUTS_DIR}/{JOB_NAME}.ldr")

    # Here modifications could be done, e.g. disconnect nodes in case of damage
    lGM = leoFeaGenerateModel.leoFeaGenerateModel(JOB_NAME)
    lGM.buildLeoFeaModel(tableLeoFeaModel)
    lGM.writeInputFiles()

    # Return comm and mail file
    m = MultipartEncoder(
        fields = {
            'mail': (f'{JOB_NAME}.mail', open(f'{OUTPUTS_DIR}/{JOB_NAME}.mail', 'rb'), 'text/plain'),
            'comm': (f'{JOB_NAME}.comm', open(f'{OUTPUTS_DIR}/{JOB_NAME}.comm', 'rb'), 'text/plain')
        }
    )

    return Response(m.to_string(), mimetype = m.content_type)

# Register app route
@APP.post("/postprocess")
def postprocess():

    # Validate request
    if not "resu" in request.files:
        return "Resu file is missing!", 400
    if not "message" in request.files:
        return "Message file is missing!", 400
    
    # Save resu and message files
    request.files["resu"].save(f"{OUTPUTS_DIR}/{JOB_NAME}.resu")
    request.files["message"].save(f"{OUTPUTS_DIR}/{JOB_NAME}.message")

    # Postprocessing
    lP =  leoFeaPostProcess.leoFeaPostProcess(JOB_NAME)
    lP.postProcessStatic()

    # Return results files
    m = MultipartEncoder(
        fields = {
            'resMinMax': (f'{JOB_NAME}.resMinMax.feather', open(f'{OUTPUTS_DIR}/{JOB_NAME}.resMinMax.feather', 'rb'), 'application/octet-stream')
            #'comm': (f'{jobname}.comm', open(f'{OUTPUTS_DIR}/{JOB_NAME}.comm', 'rb'), 'text/plain')
            # TODO simulation time
            # TODO pd_DeplNoda if requested
            # TODO pd_ForcNoda if requested
        }
    )

    return Response(m.to_string(), mimetype = m.content_type)

# Run app
APP.run(host=FLASK_HOST, port=FLASK_PORT, debug=FLASK_DBUG)