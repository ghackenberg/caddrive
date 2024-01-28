# CADdrive CFD Solver Service

## With ``docker``

To build the docker image:

```sh
cd services/cfd-solver

docker build --tag "cfd-solver" .
```

To run the docker image:

```sh
docker run -p 127.0.0.1:5001:5000 "cfd-solver"
```

## Without ``docker``

To run without docker (to obtain debug output):

```sh
cd services/cfd-solver

flask --app main run
```
