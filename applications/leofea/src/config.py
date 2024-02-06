import os.path

from importlib.resources import files

RESOURCES = files("resources")

SOURCES_DIR = os.path.dirname(__file__)

OUTPUTS_DIR = os.path.join(SOURCES_DIR, "..", "outputs")
MODELS_DIR = os.path.join(SOURCES_DIR, "..", "models")

JOB_NAME = "job"