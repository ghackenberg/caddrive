import os
import sys

FLASK_HOST = "0.0.0.0"
FLASK_PORT = 5000
FLASK_DEBUG = sys.argv.count("--debug") > 0

SRC_DIR = os.path.dirname(__file__)
OUT_DIR = os.path.join(os.sep, "out")

CODEASTER_CMD = "as_run"

JOB_NAME = "job"