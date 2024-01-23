import os.path
from flask import Flask, request, Response
from requests_toolbelt import MultipartEncoder

# LeoFEA modules
import leoFeaModelDescription 
import leoFeaGenerateModel 

app = Flask(__name__)

@app.post("/")
def createSimulationModel():

    if not "lib" in request.files:
        return "Lib file is missing!", 400
    if not "ldr" in request.files:
        return "Ldr file is missing!", 400
    
    return_str = ""

    jobname = "job"

    if not os.path.exists("./output"): 
        os.makedirs("./output")

    # Receive LDR and LIB file
    return_str += "Save file .ldr: "
    return_str += "Request Ldr received\n" 
    request.files["ldr"].save(f"./output/{jobname}.ldr")
    return_str += "OK \n"

    with open(f"./output/{jobname}.ldr", "r") as f:
        return_str += "Content of LDR file:\n"
        data = f.read()
        return_str += data

    return_str += "Save file .lib: "
    return_str += "Request Ldr received\n" 
    request.files["lib"].save(f"./output/{jobname}.lib")
    return_str += "OK \n"

    with open(f"./output/{jobname}.lib", "r") as f:
        return_str += "Content of LIB file:\n"
        data = f.read()
        return_str += data

    # Read LDR file and get table of lego parts as return
    lM = leoFeaModelDescription.leoFeaModelDescription()
    tableLeoFeaModel = lM.readFileLDR(f"./output/{jobname}.lib", f"{jobname}.ldr")
    strTableLeoFeaModel = lM.getStrTableLeoFeaModel()   # Human readable description of the lego Model

    return_str += "\nLego Model:\n"
    return_str += f"{strTableLeoFeaModel}"


    # Generate Finite Element Model
    return_str += "\nNext Step (TBD): Generate Finite Element Model\n"

    lGM = leoFeaGenerateModel.leoFeaGenerateModel(jobname)

    lGM.buildLeoFeaModel( tableLeoFeaModel )
    # Here modifications could be done, e.g. disconnect nodes in case of damage
    lGM.writeInputFiles()    #TBD

    # Return comm and mail file
    m = MultipartEncoder(
        fields = {
            'mail': (f'{jobname}.mail', open(f'./output/{jobname}.mail', 'rb'), 'text/plain'),
            'comm': (f'{jobname}.comm', open(f'./output/{jobname}.comm', 'rb'), 'text/plain')
        }
    )

    return Response(m.to_string(), mimetype = m.content_type)



    

    