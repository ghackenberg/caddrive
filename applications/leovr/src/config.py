import os.path

SRC_DIR = os.path.dirname(__file__)
OUT_DIR = os.path.join(SRC_DIR, "..", "out")

EXAMPLES_DIR = os.path.join(SRC_DIR, "..", "..", "..", "examples")

LDR_FILE = os.path.join(EXAMPLES_DIR, "CADdrive.ldr")

LDR_FILE_A = os.path.join(EXAMPLES_DIR, "Bridge A.ldr")
LDR_FILE_B = os.path.join(EXAMPLES_DIR, "Bridge B.ldr")
LDR_FILE_C = os.path.join(EXAMPLES_DIR, "Bridge C.ldr")
LDR_FILE_D = os.path.join(EXAMPLES_DIR, "Bridge D.ldr")

SCALE = 10000