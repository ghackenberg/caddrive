FROM python:3.9.18

# Change user
USER root

# Upgrade packages
RUN apt-get update
RUN apt-get upgrade -y

# Install CADdrive Python SDK
RUN mkdir /sdk

COPY --from=sdk * /sdk
WORKDIR /sdk
RUN pip install -e .

# Install CADdrive LeoFEA Service
RUN mkdir /app

COPY requirements.txt /app
WORKDIR /app
RUN pip install -r requirements.txt

COPY src /app

# Run CADdrive LeoFEA Service
WORKDIR /app/src
EXPOSE 5000/tcp
CMD python -u main.py