# CADdrive FEA Solver Service

## With ``docker``

To build the docker image:

```sh
cd <CADdrive>/services/codeaster

docker build --tag "caddrive-codeaster" .
```

To run the docker image:

```sh
docker run -p 127.0.0.1:5001:5000 "caddrive-codeaster"
```

## Without ``docker``

To run without docker (to obtain debug output):

```sh
cd <CADdrive>/services/codeaster

python main.py --debug
```