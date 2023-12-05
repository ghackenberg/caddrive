FROM ubuntu:latest

# Update dependencies
RUN apt-get update
# Install tools
RUN apt-get install wget -y

# Change directory
WORKDIR /opt
# Download aster
RUN wget https://code-aster.org/FICHIERS/aster-full-src-14.6.0-1.noarch.tar.gz
# Unpack aster
RUN tar -xvf aster-full-src-14.6.0-1.noarch.tar.gz

# Install prerequisites
RUN apt-get install gcc g++ gfortran -y
RUN apt-get install cmake -y
RUN apt-get install python3 -y
RUN apt-get install python3-dev -y
RUN apt-get install python3-numpy -y
RUN apt-get install tk -y
RUN apt-get install bison -y
RUN apt-get install flex -y
RUN apt-get install liblapack-dev libblas-dev libopenblas-dev -y
RUN apt-get install libboost-python-dev libboost-numpy-dev -y
RUN apt-get install zlib1g-dev -y

# Change directory
WORKDIR /opt/aster-full-src-14.6.0
# Trigger recompile
RUN echo "test"
# Setup aster
RUN python3 setup.py install --prefix=/opt/aster --noprompt
# Test aster
RUN /opt/aster/bin/as_run --vers=14.6 --test forma01a

# Change directory
WORKDIR /home