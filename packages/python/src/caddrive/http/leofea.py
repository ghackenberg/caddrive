import os.path

from requests import post
from requests_toolbelt import MultipartEncoder, MultipartDecoder

class LeoFEARequestFailed(Exception): pass

class LeoFEAResponseUnexpected(Exception): pass

def leoFEA(file: str, outputsDir: str, jobName: str):

    # TODO Add protocol, host, port, and path as parameter!

    # Send ldr file to sevice leoFEA
    reqDataA = MultipartEncoder(
        fields = {
            "ldr": (f'{jobName}.ldr', open(file, 'rb'), 'text/plain')
        }
    )
    resA = post("http://localhost:5000/", data = reqDataA, 
        headers = {
            "Content-Type": reqDataA.content_type
        }   
    )

    # Check for errors
    if resA.status_code != 200:
        raise LeoFEARequestFailed()
    
    # Part multipart response
    resDataA = MultipartDecoder.from_response(resA)

    # Check for errors
    if len(resDataA.parts) != 12:
        raise LeoFEAResponseUnexpected()
    
    # TODO Make robust against changes in order!
    with open(os.path.join(outputsDir, f"{jobName}.mail"), "wb") as file:
        file.write(resDataA.parts[0].content)
    with open(os.path.join(outputsDir, f"{jobName}.comm"), "wb") as file:
        file.write(resDataA.parts[1].content)

    with open(os.path.join(outputsDir, f"{jobName}.resu"), "wb") as file:
        file.write(resDataA.parts[2].content)
    with open(os.path.join(outputsDir, f"{jobName}.message"), "wb") as file:
        file.write(resDataA.parts[3].content)
    with open(os.path.join(outputsDir, f"{jobName}.rmed"), "wb") as file:
        file.write(resDataA.parts[4].content)

    with open(os.path.join(outputsDir, f"{jobName}.png"), "wb") as file:
        file.write(resDataA.parts[5].content)

    with open(os.path.join(outputsDir, f"{jobName}.depl.csv"), "wb") as file:
        file.write(resDataA.parts[6].content)
    with open(os.path.join(outputsDir, f"{jobName}.forc.csv"), "wb") as file:
        file.write(resDataA.parts[7].content)
    with open(os.path.join(outputsDir, f"{jobName}.resMinMax.csv"), "wb") as file:
        file.write(resDataA.parts[8].content)

    with open(os.path.join(outputsDir, f"{jobName}.depl.feather"), "wb") as file:
        file.write(resDataA.parts[9].content)
    with open(os.path.join(outputsDir, f"{jobName}.forc.feather"), "wb") as file:
        file.write(resDataA.parts[10].content)
    with open(os.path.join(outputsDir, f"{jobName}.resMinMax.feather"), "wb") as file:
        file.write(resDataA.parts[11].content)