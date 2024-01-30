# CADdrive Paraview Service

## With ``docker``

To build the docker image:

```sh
cd <CADdrive>/services/paraview

docker build --tag "caddrive-paraview" .
```

To run the docker image:

```sh
docker run -p 127.0.0.1:5003:5000 "caddrive-paraview"
```

## Without ``docker``

To run without docker (to obtain debug output):

```sh
cd <CADdrive>/services/paraview

python main.py --debug
```