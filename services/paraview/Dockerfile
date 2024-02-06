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

# Make directories
RUN mkdir /app
RUN mkdir /app/sdk
RUN mkdir /out

# Install APP requirements
COPY requirements.txt /app
WORKDIR /app
RUN pip install -r requirements.txt

# Install SDK dependencies
COPY --from=sdk pyproject.toml /app/sdk
WORKDIR /app/sdk
RUN pip install -e .

# Install APP + SDK sources
COPY src /app
COPY --from=sdk src /app/sdk

# Run APP
EXPOSE 5000/tcp
WORKDIR /app
CMD python -u src/main.py