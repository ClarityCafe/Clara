# Clara -Dockerfile
# This is a highly experimental Dockerfile. Use with caution.
# Licensed Under MIT. Contributed by Capuccino

FROM ubuntu:16.04 


RUN echo "force-unsafe-io" > /etc/dpkg/dpkg.cfg.d/02apt-speedup
RUN echo "Acquire::http {No-Cache=True;};" > /etc/apt/apt.conf.d/no-cache
RUN \
  apt-get update && \
  apt-get -y install \
          software-properties-common \
          git \
          nano \
          pwgen \
          unzip \
          curl \
          build-essential \
          ffmpeg \
          nodejs-legacy \
          npm
RUN echo $'#!/bin/sh\nexit 101' > /usr/sbin/policy-rc.d
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
RUN chmod +x /usr/sbin/policy-rc.d

RUN mkdir base
# It's advisable to create your config.json before launching this because we copy files
# then stab it on the container like no one cares.
COPY src/ base
COPY /package.json base
RUN git config --global user.name Nyan && git config --global user.email nyan@pa.su
RUN cd base && npm i -S && npm i -g pm2
ENV DEBIAN_FRONTEND noninteractive
ENV LANG en_GB.UTF-8
ENV LANG en_US.UTF-8
CMD tail -f /dev/null
EXPOSE 22 8080
