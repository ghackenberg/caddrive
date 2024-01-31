FROM openfoam/openfoam11-paraview510

USER root

RUN apt-get update && apt-get install python3-pip -y
RUN pip3 install Flask
RUN pip3 install requests_toolbelt

COPY main.py /root

WORKDIR /root

EXPOSE 5000/tcp

CMD python3 main.py