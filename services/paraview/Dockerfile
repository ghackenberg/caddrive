FROM python:3.10.13

# Change user
USER root

# Upgrade and install packages
RUN apt-get update
RUN apt-get upgrade -y

RUN apt-get install wget -y
RUN apt-get install libgl1 -y

# Install ParaView
WORKDIR /opt

RUN wget https://www.paraview.org/files/v5.12/ParaView-5.12.0-RC2-osmesa-MPI-Linux-Python3.10-x86_64.tar.gz
RUN tar xfz ParaView-5.12.0-RC2-osmesa-MPI-Linux-Python3.10-x86_64.tar.gz
RUN ln -s ParaView-5.12.0-RC2-osmesa-MPI-Linux-Python3.10-x86_64 paraview
RUN rm ParaView-5.12.0-RC2-osmesa-MPI-Linux-Python3.10-x86_64.tar.gz

# Install CADdrive Python SDK
RUN mkdir /sdk

COPY --from=sdk * /sdk
WORKDIR /sdk
RUN pip install -e .

# Install CADdrive Paraview Service
RUN mkdir /app

COPY requirements.txt /app
WORKDIR /app
RUN pip install -r requirements.txt

COPY src /app

# Run CADdrive ParaView Service
EXPOSE 5000/tcp
WORKDIR /app/src
CMD python -u main.py