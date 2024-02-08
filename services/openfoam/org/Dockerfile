FROM openfoam/openfoam11-paraview510

# Change user
USER root

# Upgrade and install packages
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install python3-pip -y

# Make directories
RUN mkdir /app
RUN mkdir /app/sdk
RUN mkdir /app/sdk/src
RUN mkdir /out

# Install APP requirements
COPY requirements.txt /app
WORKDIR /app
RUN pip install -r requirements.txt

# Install SDK dependencies
COPY --from=sdk pyproject.toml /app/sdk
# WORKDIR /app/sdk
# RUN pip install -e .

# Install APP + SDK sources
COPY src /app
COPY --from=sdk src/caddrive /app/sdk/src

# Run APP
EXPOSE 5000/tcp
WORKDIR /app
ENTRYPOINT python
CMD -u src/main.py