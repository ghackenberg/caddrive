FROM ubuntu:latest

RUN apt-get update
RUN apt-get install wget -y

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