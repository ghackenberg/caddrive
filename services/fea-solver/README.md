# CADdrive FEA Solver Service

## With ``docker``

To build the docker image:

```sh
cd services/fea-solver

docker build --tag "fea-solver" .
```

To run the docker image:

```sh
docker run -p 127.0.0.1:5001:5000 "fea-solver"
```

## Without ``docker``

To run without docker (to obtain debug output):

```sh
cd services/fea-solver

flask --app main run
```