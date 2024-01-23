from flask import Flask, request, Response
from requests_toolbelt import MultipartEncoder

import platform
import os

app = Flask(__name__)

@app.post("/")
def leoFeaPostprocessingParaview():
    return_str = ""

    jobname = "job"

    if not os.path.exists("./output"): 
        os.makedirs("./output")
        
    timeVisualization = 1     # Time for visualization in Paraview
    
    return_str += "Save file .rmed: "
    if "rmed" in request.files : 
        request.files["rmed"].save(f"./output/{jobname}.rmed")
        return_str += "OK \n"
    else:
        return_str += "failed\n"

    
    systemName = platform.system()
    if systemName == 'Windows':
        fNameTemplateParaview = "./resources/templatePostProcessParaviewWin.py"
        paraviewCommand = "C:/programs64/SalomeMeca2021/run_paraview.bat  --script="
    else:
        fNameTemplateParaview = "./resources/templatePostProcessParaviewLinux.py"
        paraviewCommand = "~/apps/paraview/bin/paraview "

    # Postprocessing with Paraview
    ftemp = open(fNameTemplateParaview, 'r')          # Open template file

    fnamePost = f'./output/pv_{jobname}.py'     # Postprocessing file
    fpost = open(fnamePost, 'w')

    #Write information to postprocessing file
    fpost.write(f"jobname = '{jobname}'\n")
    fpost.write(f"filename = r'./output/{jobname}'\n")
    fpost.write(f"timeVisualization = {timeVisualization}\n")
    fpost.write('\n')

    # Append template file
    for line in ftemp:
        fpost.write(line)

    ftemp.close()
    fpost.close()

    # Start Paraview
    command = f"{paraviewCommand}{fnamePost} &"

    print(command)
    ret = os.system(command)
    print(ret)



    # Return results files
 #   m = MultipartEncoder(
 #       fields = {
 #           'resultsMinMax': (f'{jobname}.resultsMinMax', open(f'./output/{jobname}.resultsMinMax.feather', 'rb'), 'text/plain')
 #           #'comm': (f'{jobname}.comm', open(f'./output/{jobname}.comm', 'rb'), 'text/plain')
 #           # Todo: simulation time
 #           # Todo: pd_DeplNoda if requested
 #           # Todo: pd_ForcNoda if requested
 #           }
 #       )

 #   return Response(m.to_string(), mimetype = m.content_type)

    return(return_str)


