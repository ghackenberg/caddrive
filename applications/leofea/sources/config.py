import sys

FLASK_HOST = "0.0.0.0"
FLASK_PORT = 5000
FLASK_DBUG = sys.argv.count("--debug") > 0

RESOURCES_DIR = "../resources"
LEOCADMODELS_DIR = "../leoCADmodels"
RESOURCES_LEOFEA_DIR = "../../../services/leofea/resources"
FILENAME_LIB_LDR = f"{RESOURCES_LEOFEA_DIR}/leoFeaPartLibrary.lib"
SOURCES_LEOFEA_DIR = "../../../services/leofea/sources"
OUTPUTS_DIR = "../outputs"

COMMAND_START_LEOCAD_WIN = r"START C:\programs64\LeoCAD\leoCAD.exe"                                 # TBD genearalize
COMMAND_START_LEOCAD_LINUX = "/home/christian/appImages/LeoCAD-Linux-23.03-x86_64.AppImage &"       # TBD generalize


JOB_NAME = "job"