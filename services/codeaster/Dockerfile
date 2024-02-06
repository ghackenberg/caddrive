FROM krande/codeaster:seq-15.8.0

# Change user
USER root

# Upgrade and install packages
RUN apt-get update
RUN apt-get upgrade -y

RUN apt-get install python3-pip -y

# Install CADdrive CodeAster Service
RUN mkdir /app

COPY requirements.txt /app
WORKDIR /app
RUN pip3 install -r requirements.txt

COPY src /app

# Run CADdrive CodeAster Service
EXPOSE 5000/tcp
WORKDIR /app/src
CMD python -u main.py