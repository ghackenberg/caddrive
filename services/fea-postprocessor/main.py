from flask import Flask, request, Response
from requests_toolbelt import MultipartEncoder

# LeoFEA modules
import leoFeaPostProcess 

app = Flask(__name__)

@app.post("/")
def leoFeaPostprocessing():
    return_str = ""

    jobname = "job"
    
    # Receive Resu, Message and rmed
    return_str += "Save file .resu: "
    if "resu" in request.files : 
        request.files["resu"].save(f"./output/{jobname}.resu")
        return_str += "OK \n"
    else:
        return_str += "failed\n"

    return_str += "Save file .message: "
    if "message" in request.files : 
        request.files["message"].save(f"./output/{jobname}.message")
        return_str += "OK \n"
    else:
        return_str += "failed\n"


#    return_str += "Save file .rmed: "
#    if "rmed" in request.files : 
#        request.files["rmed"].save(f"{jobname}.rmed")
#        return_str += "OK \n"
#    else:
#        return_str += "failed\n"



    # Postprocessing
    lP =  leoFeaPostProcess.leoFeaPostProcess( jobname )

    lP.postProcessStatic()


    # Return results files
    m = MultipartEncoder(
        fields = {
            'resultsMinMax': (f'{jobname}.resultsMinMax', open(f'./output/{jobname}.resultsMinMax.feather', 'rb'), 'text/plain')
            #'comm': (f'{jobname}.comm', open(f'./output/{jobname}.comm', 'rb'), 'text/plain')
            # Todo: simulation time
            # Todo: pd_DeplNoda if requested
            # Todo: pd_ForcNoda if requested
            }
        )

    return Response(m.to_string(), mimetype = m.content_type)



