import os.path

from importlib.resources import files

RESOURCES = files("resources")

SRC_DIR = os.path.dirname(__file__)

OUT_DIR = os.path.join(SRC_DIR, "..", "out")

EXAMPLES_DIR = os.path.join(SRC_DIR, "..", "..", "..", "examples")

JOB_NAME = "job"