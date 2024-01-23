FROM python:3.10.13

USER root

# Install ParaView
RUN apt-get update && apt-get install wget -y
RUN cd /opt && wget https://www.paraview.org/files/v5.12/ParaView-5.12.0-RC2-osmesa-MPI-Linux-Python3.10-x86_64.tar.gz
RUN cd /opt && tar xfz ParaView-5.12.0-RC2-osmesa-MPI-Linux-Python3.10-x86_64.tar.gz
RUN cd /opt && ln -s ParaView-5.12.0-RC2-osmesa-MPI-Linux-Python3.10-x86_64 paraview

# Install Flask
RUN pip install Flask
RUN pip install requests_toolbelt

# Install OpenGL
RUN apt-get install libgl1 -y

# Make directories
RUN mkdir /app
RUN mkdir /app/resources

# Copy sources
COPY main.py /app
COPY resources/templatePostProcessParaviewLinux.py /app/resources
COPY resources/templatePostProcessParaviewWin.py /app/resources

# Set directory
WORKDIR /app

# Expose port
EXPOSE 5000/tcp

# Configure flask
ENV FLASK_APP=main.py
ENV FLASK_ENV=development

# Start flask
CMD flask run --host=0.0.0.0