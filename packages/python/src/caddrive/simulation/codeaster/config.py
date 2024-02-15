from importlib.resources import files

# Resources
RESOURCES = files('caddrive.simulation.codeaster.resources')

# Templates
TEMPLATE_COMM_STATIC = RESOURCES.joinpath("templateCommStatic.comm")
TEMPLATE_COMM_MODAL = RESOURCES.joinpath("templateCommModal.comm")
TEMPLATE_COMM_DYN = RESOURCES.joinpath("templateCommDyn.comm")
CONVERT_MESH = RESOURCES.joinpath("convertMesh.comm")

# AnalysisTypes
ANALYSIS_STATIC = "Static"
ANALYSIS_MODAL = "Modal"
ANALYSIS_DYNAMIC = "Dynamic"