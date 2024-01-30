# CADdrive LeoFEA Service

## With ``docker``

To build the docker image:

```sh
cd <CADdrive>/services/leofea

docker build --tag "caddrive-leofea" .
```

To run the docker image:

```sh
docker run -p 127.0.0.1:5000:5000 "caddrive-leofea"
```

## Without ``docker``

To run without docker (to obtain debug output):

```sh
cd <CADdrive>/services/leafea

python main.py --debug
```