# CADdrive OpenFOAM Service

## Openfoam11 (openfoam.org)

## With ``docker``

To build the docker image:

```sh
cd <CADdrive>/services/openfoam_org

docker build --tag "caddrive-openfoam-org" .
```

To run the docker image:

```sh
docker run -p 127.0.0.1:5002:5000 "caddrive-openfoam-org"
```

## Without ``docker``

To run without docker (to obtain debug output):

```sh
cd <CADdrive>/services/openfoam_org

python main.py --debug
```
