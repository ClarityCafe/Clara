# Clara -Dockerfile
# This is a highly experimental Dockerfile. Use with caution.
# Licensed Under MIT. Contributed by Capuccino

FROM ubuntu:16.xvrdm/ubuntu-16.04

RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash

RUN sudo \

sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd && \
echo "%sudo ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers 

RUN sudo apt install build-essential python

RUN nvm install v6.10.0 && nvm alias default v6.10.0

USER ayaneru

RUN mkdir base

COPY src /home/ayaneru/base

RUN cd base && npm i -S 