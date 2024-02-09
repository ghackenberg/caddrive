from requests import post
from requests_toolbelt import MultipartEncoder, MultipartDecoder

def codeaster(outDir: str, jobName: str, fileMail: str, fileComm: str):
    
    reqDataA = MultipartEncoder(
        fields = {
            "mail": (f'{jobName}.mail', open(fileMail, 'rb'), 'text/plain'),
            "comm": (f'{jobName}.comm', open(fileComm, 'rb'), 'text/plain')
        }
    )
    resA = post("http://localhost:5001/", data = reqDataA, headers = {
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
    with open(f"{outDir}/{jobName}.resu", "wb") as file:
        file.write(resDataA.parts[0].content)
    with open(f"{outDir}/{jobName}.message", "wb") as file:
        file.write(resDataA.parts[1].content)
    with open(f"{outDir}/{jobName}.rmed", "wb") as file:
        file.write(resDataA.parts[2].content)