FROM opencfd/openfoam-run

USER root

RUN apt-get update && apt-get install python3-pip -y
RUN pip3 install Flask
RUN pip3 install requests_toolbelt

RUN mkdir /app

COPY main.py /app

WORKDIR /app

EXPOSE 5000/tcp

ENV FLASK_APP=main.py
ENV FLASK_ENV=development

CMD flask run --host=0.0.0.0

