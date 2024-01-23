FROM python:3.9.18

USER root

#RUN apt-get update && apt-get install python3-pip -y
RUN pip install Flask
RUN pip install requests_toolbelt
RUN pip install numpy

RUN mkdir /app
RUN mkdir /app/resources
RUN mkdir /app/output

COPY main.py /app
COPY leoFeaModelDescription.py /app
COPY leoFeaBasicPart.py /app
COPY leoFeaGenerateModel.py /app
COPY /resources/leoFeaPartLibrary.lib /app/resources
COPY /resources/templateCommStatic.comm /app/resources
COPY /resources/templateCommModal.comm /app/resources
COPY /resources/templateCommDyn.comm /app/resources


WORKDIR /app

EXPOSE 5000/tcp

ENV FLASK_APP=main.py
ENV FLASK_ENV=development

CMD flask run --host=0.0.0.0