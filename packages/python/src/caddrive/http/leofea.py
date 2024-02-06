import os.path

from requests import post
from requests_toolbelt import MultipartEncoder, MultipartDecoder

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
        raise Exception("LeoFEA Service Error")
    
    # Part multipart response
    resDataA = MultipartDecoder.from_response(resA)

    # Check for errors
    if len(resDataA.parts) != 3:
        raise Exception("LeoFEA Service Error")
    
    # TODO Make robust against changes in order!
    with open(os.path.join(outputsDir, f"{jobName}.resMinMax"), "wb") as file:
        file.write(resDataA.parts[0].content)
    with open(os.path.join(outputsDir, f"{jobName}.png"), "wb") as file:
        file.write(resDataA.parts[1].content)
    with open(os.path.join(outputsDir, f"{jobName}.rmed"), "wb") as file:
        file.write(resDataA.parts[2].content)