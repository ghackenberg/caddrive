FROM python:3.9.18

USER root

RUN pip install Flask
RUN pip install requests_toolbelt
RUN pip install numpy
RUN pip install feather-format 
RUN pip install pandas

RUN mkdir /app

COPY main.py /app
COPY leoFeaBasicPart.py /app
COPY leoFeaGenerateModel.py /app
COPY leoFeaModelDescription.py /app
COPY leoFeaPostProcess.py /app

WORKDIR /app

EXPOSE 5000/tcp

CMD flask --app main run --host 0.0.0.0 