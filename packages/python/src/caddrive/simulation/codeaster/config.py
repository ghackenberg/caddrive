from importlib.resources import files

# Resources
RESOURCES = files('caddrive.simulation.leofea.resources')

# Templates
TEMPLATE_COMM_STATIC = RESOURCES.joinpath("templateCommStatic.comm")
TEMPLATE_COMM_MODAL = RESOURCES.joinpath("templateCommModal.comm")
TEMPLATE_COMM_DYN = RESOURCES.joinpath("templateCommDyn.comm")
CONVERT_MESH = RESOURCES.joinpath("convertMesh.comm")