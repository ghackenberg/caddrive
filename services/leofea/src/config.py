import os
import sys

FLASK_HOST = "0.0.0.0"
FLASK_PORT = 5000
FLASK_DEBUG = sys.argv.count("--debug") > 0

SRC_DIR = os.path.dirname(__file__)
OUT_DIR = os.path.join(os.sep, "out")

JOB_NAME = "job"

FILE_LDR = os.path.join(OUT_DIR, f"{JOB_NAME}.ldr")
FILE_MAIL = os.path.join(OUT_DIR, f"{JOB_NAME}.mail")
FILE_COMM = os.path.join(OUT_DIR, f"{JOB_NAME}.comm")
FILE_RESU = os.path.join(OUT_DIR, f"{JOB_NAME}.resu")
FILE_MESSAGE = os.path.join(OUT_DIR, f"{JOB_NAME}.message")
FILE_RMED = os.path.join(OUT_DIR, f"{JOB_NAME}.rmed")
FILE_PNG = os.path.join(OUT_DIR, f"{JOB_NAME}.png")
FILE_RES_MIN_MAX_CSV = os.path.join(OUT_DIR, f"{JOB_NAME}.resMinMax.csv")
FILE_RES_MIN_MAX_FEATHER = os.path.join(OUT_DIR, f"{JOB_NAME}.resMinMax.feather")