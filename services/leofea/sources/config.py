import sys

FLASK_HOST = "0.0.0.0"
FLASK_PORT = 5000
FLASK_DEBUG = sys.argv.count("--debug") > 0

RESOURCES_DIR = "../resources"
OUTPUTS_DIR = "../outputs"

JOB_NAME = "job"