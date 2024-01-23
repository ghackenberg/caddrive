# CADdrive FEA Preprocessor Service

## With ``docker``

To build the docker image:

```sh
cd services/fea-preprocessor

docker build --tag "fea-preprocessor" .
```

To run the docker image:

```sh
docker run -p 127.0.0.1:5000:5000 "fea-preprocessor"
```

## Without ``docker``

To run without docker (to obtain debug output):

```sh
cd services/fea-preprocessor

flask --app main run
```