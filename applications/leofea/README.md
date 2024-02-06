# CADdrive LeoFEA

A graphical user interface for the LeoFEA service. This user interface is mostly used for testing. Maybe, we will turn it into a production-grade application at some point.

## Developer guide

### Install external dependencies

External dependencies can be installed from the requirements file.

```sh
cd <CADdrive>/applications/leofea

pip install -r requirements.txt
```

### Install interal dependencies

Internal dependencies must be installed from the source directories.

#### LeoFEA

```sh
cd <CADdrive>/packages/leofea

pip install -e .
```