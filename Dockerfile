# Clara -Dockerfile
# This is a highly experimental Dockerfile. Use with caution.
# Licensed Under MIT. Contributed by Capuccino

# We would use the Latest Ubuntu LTS for this image.

FROM ubuntu:16.04  

# Environment Variables

ENV NODE_VERSION=6.10.1 \
NODE_PATH=/usr/local/lib/node_modules \
USERNAME=clara 

# Install Essentials
RUN echo "force-unsafe-io" > /etc/dpkg/dpkg.cfg.d/02apt-speedup
RUN echo "Acquire::http {No-Cache=True;};" > /etc/apt/apt.conf.d/no-cache
RUN \
  apt-get update && \
  apt-get -y install \
          openssh-client \
          software-properties-common \
          git \
          nano \
          pwgen \
          unzip \
          curl \
          build-essential \
          ffmpeg 

# now we add a normal user with sudo privs
# we use the USERNAME variable as the pwd for the container.

RUN useradd --password $USERNAME --create-home $USERNAME && usermod -aG sudo $USERNAME 

# Preinstall a Node Version. In This case, we provided a ENV_Variable for it 
RUN cd /home/$USERNAME && curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
&& sudo ln -s /usr/local/bin/node /usr/local/bin/nodejs


# install NVM
RUN echo $'#!/bin/sh\nexit 101' > /usr/sbin/policy-rc.d
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
RUN chmod +x /usr/sbin/policy-rc.d

RUN mkdir $HOME_PATH/base

# It's advisable to create your config.json before launching this because we copy files
# then stab it on the container like no one cares.

COPY src/ /home/$USERNAME/base
COPY /package.json /home/$USERNAME/base

#We're gonna add a pseudo-user here

RUN git config --global user.name nyan && git config --global user.email nyan@pa.su

RUN cd $HOME_PATH/base && npm i --save && npm i -g pm2

#Additional ENV_Variables

ENV DEBIAN_FRONTEND noninteractive
ENV LANG en_GB.UTF-8
ENV LANG en_US.UTF-8
CMD tail -f /dev/null

#Expose Local port and SSH Port just because we can

EXPOSE 22 8080
