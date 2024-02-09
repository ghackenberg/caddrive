import os.path

SRC_DIR = os.path.dirname(__file__)
OUT_DIR = os.path.join(SRC_DIR, "..", "out")

EXAMPLES_DIR = os.path.join(SRC_DIR, "..", "..", "..", "examples")

LDR_FILE = os.path.join(EXAMPLES_DIR, "CADdrive.ldr")

JOB_NAME = "job"

MAIL_FILE = os.path.join(OUT_DIR, f"{JOB_NAME}.mail")
COMM_FILE = os.path.join(OUT_DIR, f"{JOB_NAME}.comm")
RESU_FILE = os.path.join(OUT_DIR, f"{JOB_NAME}.resu")

SCALE = 10000