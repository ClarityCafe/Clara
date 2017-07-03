# Clara Dockerfile
# Copyright 2017 (c) Clara
# Licensed under MIT

FROM ubuntu:16.04

#overrides for APT cache

RUN echo "force-unsafe-io" > /etc/dpkg/dpkg.cfg.d/02apt-speedup
RUN echo "Acquire::http {No-Cache=True;};" > /etc/apt/apt.conf.d/no-cache

# get dependencies

RUN apt update && \
    apt -y install \
    apt-utils \ 
    wget \
    sudo \
    bash \
    git \
    wget \
    ssh \
    tar \
    gzip \
    build-essential \
    ffmpeg \
    python3-pip \
    protobuf-compiler python \
    libprotobuf-dev \ 
    libcurl4-openssl-dev \
    libboost-all-dev \ 
    libncurses5-dev \
    libjemalloc-dev \
    m4
    
#RethinkDB

RUN wget https://download.rethinkdb.com/dist/rethinkdb-2.3.5.tgz && \
tar xf rethinkdb-2.3.5.tgz && \
cd rethinkdb-2.3.5 && \
./configure --allow-fetch && \
make && \
sudo make install && \
rm -rf /rethinkdb-2.3.5
    
# node    

RUN wget -qO- https://deb.nodesource.com/setup_8.x | sudo -E bash -
RUN apt update && apt -y install nodejs

    
# now we create a dummy account 

RUN adduser --disabled-password --gecos "" clara && adduser clara sudo && su clara
WORKDIR /home/clara
RUN git config --global user.name nyan && git config --global user.email nyan@pa.su

#Expose Local port and SSH Port just because we can

EXPOSE 22 8080

ENTRYPOINT ["node", "~/src/bot.js"]

# Install deps

RUN npm i --silent

# It's advisable to add your config files so if we run docker run, it wouldn't error out.

COPY . . 

# finally echo this in a fancy way

RUN echo "senpai it worked!"
