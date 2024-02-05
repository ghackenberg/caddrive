FROM opencfd/openfoam-run

# Change user
USER root

# Update packages
RUN apt-get update
# Upgrade packages
RUN apt-get upgrade -y
# Install packages
RUN apt-get install python3-pip -y

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
# Run application
CMD python3 -u main.py