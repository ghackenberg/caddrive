# External dependencies
import os

from flask import Flask, request, Response
from requests import post
from requests_toolbelt import MultipartEncoder, MultipartDecoder

# Internal dependencies
import caddrive

from config import *

# Ensure folder
if not os.path.exists(OUT_DIR): os.makedirs(OUT_DIR)

# Create app
APP = Flask(__name__)

# Register route
@APP.post("/")
def index():

    # Validate request
    if not "ldr" in request.files:
        return "Ldr file is missing!", 400

    # Save LDR file
    request.files["ldr"].save(FILE_LDR)
    
    if not "xml" in request.files:
        return "xml file (simulation settings) is missing", 400

    # Save XML file
    request.files["xml"].save(FILE_XML)
    
    ######## PREPROCESSING
    # Read LDR file and get table of lego parts as return
    parser = caddrive.ldraw.parsers.TableParser()
    tableLeoFeaModel = parser.readFileLDR(FILE_LDR)

    # Here modifications could be done, e.g. disconnect nodes in case of damage
    preProcessor = caddrive.simulation.codeaster.PreProcessor(OUT_DIR, JOB_NAME, FILE_XML)
    preProcessor.buildLeoFeaModel(tableLeoFeaModel)
    preProcessor.writeInputFiles()

    ######## SOLVER
    # Send mail and comm files to CodeAster and receive simulation results
    reqDataA = MultipartEncoder(
        fields = {
            "mail": (f'{JOB_NAME}.mail', open(FILE_MAIL, 'rb'), 'text/plain'),
            "comm": (f'{JOB_NAME}.comm', open(FILE_COMM, 'rb'), 'text/plain')
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
    with open(FILE_RESU, "wb") as file:
        file.write(resDataA.parts[0].content)
    with open(FILE_MESSAGE, "wb") as file:
        file.write(resDataA.parts[1].content)
    with open(FILE_RMED, "wb") as file:
        file.write(resDataA.parts[2].content)
    
    # Send rmed file to ParaView and receive rendered image
    reqDataB = MultipartEncoder(
        fields = {
            "rmed": (f'{JOB_NAME}.rmed', open(FILE_RMED, 'rb'), 'text/plain')
        }
    )
    resB = post("http://paraview:5000/", data = reqDataB, headers = {
        "Content-Type": reqDataB.content_type
    })

    # Check for errors
    if resB.status_code != 200:
        return "ParaView error", 400

    # Save parts to output folder
    with open(f"{OUT_DIR}/{JOB_NAME}.png", "wb") as file:
        file.write(resB.content)

    # Postprocess the output files
    postProcessor =  caddrive.simulation.codeaster.PostProcessor(OUT_DIR, JOB_NAME)
    postProcessor.postProcessStatic()

    # Return results files
    m = MultipartEncoder(
        fields = {
            'mail': (f'{JOB_NAME}.mail', open(FILE_MAIL, 'rb'), 'text/plain'),
            'comm': (f'{JOB_NAME}.comm', open(FILE_COMM, 'rb'), 'text/plain'),

            'resu': (f'{JOB_NAME}.resu', open(FILE_RESU, 'rb'), 'text/plain'),
            'message': (f'{JOB_NAME}.message', open(FILE_MESSAGE, 'rb'), 'text/plain'),
            'rmed': (f'{JOB_NAME}.rmed', open(FILE_RMED, 'rb'), 'text/plain'),
            
            'png': (f'{JOB_NAME}.png', open(FILE_PNG, 'rb'), 'text/plain'),

            'depl.csv': (f'{JOB_NAME}.depl.csv', open(FILE_DEPL_CSV, 'rb'), 'text/plain'),
            'forc.csv': (f'{JOB_NAME}.forc.csv', open(FILE_FORC_CSV, 'rb'), 'text/plain'),
            'resMinMax.csv': (f'{JOB_NAME}.resMinMax.csv', open(FILE_RES_MIN_MAX_CSV, 'rb'), 'text/plain'),

            'depl.feather': (f'{JOB_NAME}.depl.feather', open(FILE_DEPL_FEATHER, 'rb'), 'application/octet-stream'),
            'forc.feather': (f'{JOB_NAME}.forc.feather', open(FILE_FORC_FEATHER, 'rb'), 'application/octet-stream'),
            'resMinMax.feather': (f'{JOB_NAME}.resMinMax.feather', open(FILE_RES_MIN_MAX_FEATHER, 'rb'), 'application/octet-stream')

            # TODO simulation time
            # TODO pd_DeplNoda if requested
            # TODO pd_ForcNoda if requested
        }
    )

    return Response(m.to_string(), mimetype = m.content_type)

# Register app route
@APP.post("/preprocess")
def preprocess():

    # Validate request
    if not "ldr" in request.files:
        return "Ldr file is missing!", 400

    # Save LDR and LIB file
    request.files["ldr"].save(FILE_LDR)

    # Read LDR file and get table of lego parts as return
    parser = caddrive.ldraw.parsers.TableParser()
    tableLeoFeaModel = parser.readFileLDR(FILE_LDR)

    # Here modifications could be done, e.g. disconnect nodes in case of damage
    preProcessor = caddrive.simulation.codeaster.PreProcessor(OUT_DIR, JOB_NAME)
    preProcessor.buildLeoFeaModel(tableLeoFeaModel)
    preProcessor.writeInputFiles()

    # Return comm and mail file
    m = MultipartEncoder(
        fields = {
            'mail': (f'{JOB_NAME}.mail', open(FILE_MAIL, 'rb'), 'text/plain'),
            'comm': (f'{JOB_NAME}.comm', open(FILE_COMM, 'rb'), 'text/plain')
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
    request.files["resu"].save(FILE_RESU)
    request.files["message"].save(FILE_MESSAGE)

    # Postprocessing
    postProcessor =  caddrive.simulation.codeaster.PostProcessor(OUT_DIR, JOB_NAME)
    postProcessor.postProcessStatic()

    # Return results files
    m = MultipartEncoder(
        fields = {
            'depl.csv': (f'{JOB_NAME}.depl.csv', open(FILE_DEPL_CSV, 'rb'), 'text/plain'),
            'forc.csv': (f'{JOB_NAME}.forc.csv', open(FILE_FORC_CSV, 'rb'), 'text/plain'),
            'resMinMax.csv': (f'{JOB_NAME}.resMinMax.csv', open(FILE_RES_MIN_MAX_CSV, 'rb'), 'text/plain'),

            'depl.feather': (f'{JOB_NAME}.depl.feather', open(FILE_DEPL_FEATHER, 'rb'), 'application/octet-stream'),
            'forc.feather': (f'{JOB_NAME}.forc.feather', open(FILE_FORC_FEATHER, 'rb'), 'application/octet-stream'),
            'resMinMax.feather': (f'{JOB_NAME}.resMinMax.feather', open(FILE_RES_MIN_MAX_FEATHER, 'rb'), 'application/octet-stream')
            # TODO simulation time
            # TODO pd_DeplNoda if requested
            # TODO pd_ForcNoda if requested
        }
    )

    return Response(m.to_string(), mimetype = m.content_type)

# Run app
APP.run(host=FLASK_HOST, port=FLASK_PORT, debug=FLASK_DEBUG)