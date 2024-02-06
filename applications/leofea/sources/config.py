import os.path

SOURCES_DIR = os.path.dirname(__file__)
RESOURCES_DIR = os.path.join(SOURCES_DIR, "../resources")
OUTPUTS_DIR = os.path.join(SOURCES_DIR, "../outputs")
MODELS_DIR = os.path.join(SOURCES_DIR, "../models")

FILENAME_LIB_LDR = os.path.join(RESOURCES_DIR, "leoFeaPartLibrary.lib")

COMMAND_START_LEOCAD_WIN = r"START C:\programs64\LeoCAD\leoCAD.exe"                                 # TODO genearalize
COMMAND_START_LEOCAD_LINUX = "/home/christian/appImages/LeoCAD-Linux-23.03-x86_64.AppImage &"       # TODO generalize

PARAVIEW_CMD_LINUX = "~/apps/paraview/bin/paraview"                                                 # TODO generalize
PARAVIEW_RES_LINUX = os.path.join(RESOURCES_DIR, "templatePostProcessParaviewLinux.py")             # TODO generalize
 
#PARAVIEW_CMD_WIN = "C:/programs64/SalomeMeca2021/run_paraview.bat  --script="                      # TODO generalize
PARAVIEW_CMD_WIN = "C:/programs64/Paraview5_12_RC/bin/paraview"
PARAVIEW_RES_WIN = os.path.join(RESOURCES_DIR, "templatePostProcessParaviewWin.py")                 # TODO generalize

JOB_NAME = "job"