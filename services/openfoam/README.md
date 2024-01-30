# CADdrive OpenFOAM Service

## With ``docker``

To build the docker image:

```sh
cd <CADdrive>/services/openfoam

docker build --tag "caddrive-openfoam" .
```

To run the docker image:

```sh
docker run -p 127.0.0.1:5002:5000 "caddrive-openfoam"
```

## Without ``docker``

To run without docker (to obtain debug output):

```sh
cd <CADdrive>/services/openfoam

python main.py --debug
```
