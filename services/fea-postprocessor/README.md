# CADdrive FEA Postprocessor Service

## With ``docker``

To build the docker image:

```sh
cd services/fea-postprocessor

docker build --tag "fea-postprocessor" .
```

To run the docker image:

```sh
docker run -p 127.0.0.1:5002:5000 "fea-postprocessor"
```

## Without ``docker``

To run without docker (to obtain debug output):

```sh
cd services/fea-postprocessor

flask --app main run
```