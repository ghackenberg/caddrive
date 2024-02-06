import sys
import os.path

FLASK_HOST = "0.0.0.0"
FLASK_PORT = 5000
FLASK_DEBUG = sys.argv.count("--debug") > 0

SOURCES_DIR = os.path.dirname(__file__)
OUTPUTS_DIR = os.path.join(SOURCES_DIR, "..", "outputs")

CODEASTER_CMD = "as_run"

JOB_NAME = "job"