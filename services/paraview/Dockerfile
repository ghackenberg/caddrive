FROM python:3.10.13

# Change user
USER root

# Update packages
RUN apt-get update
# Upgrade packages
RUN apt-get upgrade -y
# Install packages
RUN apt-get install wget -y
RUN apt-get install libgl1 -y

# Change workdir
WORKDIR /opt
# Install ParaView
RUN wget https://www.paraview.org/files/v5.12/ParaView-5.12.0-RC2-osmesa-MPI-Linux-Python3.10-x86_64.tar.gz
RUN tar xfz ParaView-5.12.0-RC2-osmesa-MPI-Linux-Python3.10-x86_64.tar.gz
RUN ln -s ParaView-5.12.0-RC2-osmesa-MPI-Linux-Python3.10-x86_64 paraview
RUN rm ParaView-5.12.0-RC2-osmesa-MPI-Linux-Python3.10-x86_64.tar.gz

# Make directory
RUN mkdir /app

# Copy requirements
COPY requirements.txt /app

# Change workdir
WORKDIR /app
# Install requirements
RUN pip install -r requirements.txt

# Copy sources
COPY sources /app
# Copy resources
COPY resources /app

# Change workdir
WORKDIR /app/sources
# Expose port
EXPOSE 5000/tcp
# Start flask
CMD python -u main.py