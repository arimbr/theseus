# Set the base image to Ubuntu
FROM ubuntu

# Add the application resources URL
RUN echo deb http://archive.ubuntu.com/ubuntu precise universe >> /etc/apt/sources.list

# Update the sources list
RUN apt-get update

# Install basic applications
RUN apt-get install -y tar git curl nano wget dialog net-tools build-essential

# Install Python and Basic Python Tools
RUN apt-get install -y python3 python3-dev python-pip

# Install Scrapy dependencies
RUN apt-get install -y libxml2-dev libxslt1-dev zlib1g-dev libffi-dev libssl-dev

# Copy the application folder inside the container
# TODO: should download from Github repo
#RUN git clone https://github.com/arimbr/theseus.git
ADD /home/ari/theseus/collect/requirements.txt /

# Get pip to download and install requirements:
RUN pip install -r /theseus/collect/requirements.txt