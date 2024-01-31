# CADdrive OpenFOAM Service
## Openfoam2312 (openfoam.com)

## With ``docker``

To build the docker image:

```sh
cd <CADdrive>/services/openfoam_com

docker build --tag "caddrive-openfoam-com" .
```

To run the docker image:

```sh
docker run -p 127.0.0.1:5002:5000 "caddrive-openfoam-com"
```

## Without ``docker``

To run without docker (to obtain debug output):

```sh
cd <CADdrive>/services/openfoam_com

python main.py --debug
```
