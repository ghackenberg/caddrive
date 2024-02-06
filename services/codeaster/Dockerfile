FROM krande/codeaster:seq-15.8.0

# Change user
USER root

# Upgrade and install packages
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install python3-pip -y

# Make directories
RUN mkdir /app
RUN mkdir /app/sdk
RUN mkdir /out

# Install APP requirements
COPY requirements.txt /app
WORKDIR /app
RUN pip3 install -r requirements.txt

# Install SDK dependencies
COPY --from=sdk pyproject.toml /app/sdk
# WORKDIR /app/sdk
# RUN pip3 install -e .

# Install APP + SDK sources
COPY src /app
COPY --from=sdk src /app/sdk

# Run APP
EXPOSE 5000/tcp
WORKDIR /app
CMD python -u src/main.py