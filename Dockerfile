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
    software-properties-common \
    python-software-properties \
    wget \
    sudo \
    bash \
    git \
    wget \
    ssh \
    tar \
    gzip \
    openssh-server \
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
    
 # node    
 
 RUN wget -qO- https://deb.nodesource.com/setup_8.x | sudo -E bash -
 RUN apt update && apt -y install nodejs
 
     
 # now we create a dummy account 
 RUN mkdir /var/run/sshd && \
     sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd && \
     echo "%sudo ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers && \
     useradd -u 1000 -G users,sudo -d /home/clara --shell /bin/bash -m clara && \
     usermod -p "*" clara
 USER clara
 
 #Expose Local port and SSH Port just because we can
 
EXPOSE 22 8080

ENTRYPOINT ["node", "/Clara/src/bot.js"]

# It's advisable to add your config files so if we run docker run, it wouldn't error out.

RUN sudo git clone https://github.com/ClaraIO/Clara.git --bare --depth=3
RUN cd /Clara && sudo npm i --save && sudo npm i -g pm2 

CMD ["/usr/sbin/sshd", "-p 22", "-D", "&&", "node", "/Clara/src/bot --harmony"]

# finally echo this in a fancy way

RUN echo "senpai it worked!"
