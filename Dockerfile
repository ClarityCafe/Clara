# Clara -Dockerfile
# This is a highly experimental Dockerfile. Use with caution.
# Licensed Under MIT. Contributed by Capuccino

FROM ubuntu:16.04 
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
RUN apt-get update && \
    apt-get -y install \
    sudo \
    procps \
    wget \
    build-essential \ 
    python \
    unzip \
    mc \
    ca-certificates \
    curl \
    software-properties-common \
    python-software-properties \
    bash-completion
USER user
RUN mkdir /home/user/base
# It's advisable to create your config.json before launching this because we copy files
# then stab it on the container like no one cares.
COPY src/* /home/user/base
COPY package.json /home/user/base
RUN cd base && npm i -S 
# now we launch the bot
RUN node bot --harmony
ENV LANG en_GB.UTF-8
ENV LANG en_US.UTF-8
CMD tail -f /dev/null
EXPOSE 22 8080
