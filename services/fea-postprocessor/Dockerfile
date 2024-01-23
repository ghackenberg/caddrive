FROM python:3.9.18

USER root

#RUN apt-get update && apt-get install python3-pip -y
RUN pip install Flask
RUN pip install requests_toolbelt
RUN pip install numpy
RUN pip install feather-format 
RUN pip install pandas

RUN mkdir /app
RUN mkdir /app/output

COPY main.py /app
COPY leoFeaPostProcess.py /app

WORKDIR /app

EXPOSE 5000/tcp

ENV FLASK_APP=main.py
ENV FLASK_ENV=development

CMD flask run --host=0.0.0.0