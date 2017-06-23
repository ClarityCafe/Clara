# Clara Dockerfile
# Copyright 2017 (c) Clara
# Licensed under MIT
FROM ubuntu:16.04

#overrides for APT cache
RUN echo "force-unsafe-io" > /etc/dpkg/dpkg.cfg.d/02apt-speedup
RUN echo "Acquire::http {No-Cache=True;};" > /etc/apt/apt.conf.d/no-cache

# get dependencies
RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
RUN apt update && \
    apt -y install \
    sudo \
    bash \
    git \
    wget \
    ssh \
    tar \
    gzip \
    build-essential \
    ffmpeg \
    python3-pip && \
    python3 -m pip install flake8
    
# now we create a dummy account 
RUN adduser --disabled-password --gecos "" clara && adduser clara sudo && su clara
WORKDIR /home/clara
RUN git config --global user.name nyan && git config --global user.email nyan@pa.su
