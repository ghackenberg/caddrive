from importlib.resources import files

# Resources
RESOURCES = files('caddrive.ldraw.resources')

# Libraries
PART_LIB = RESOURCES.joinpath("parts.lib")