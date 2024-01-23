# CADdrive FEA Paraview Service

## With ``docker``

To build the docker image:

```sh
cd services/fea-paraview

docker build --tag "fea-paraview" .
```

To run the docker image:

```sh
docker run -p 127.0.0.1:5003:5000 "fea-paraview"
```

## Without ``docker``

To run without docker (to obtain debug output):

```sh
cd services/fea-paraview

flask --app main run
```