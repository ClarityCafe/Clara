# Clara -Dockerfile
# This is a highly experimental Dockerfile. Use with caution.
# Licensed Under MIT. Contributed by Capuccino

FROM ubuntu:1and1internet/ubuntu-16
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
RUN sudo \
sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd && \
echo "%sudo ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers 
RUN sudo apt install build-essential python
RUN nvm install v6.10.0 && nvm alias default v6.10.0
USER ayaneru
RUN mkdir base
# It's advisable to create your config.json before launching this because we copy files
# then stab it on the container like no one cares.
COPY src /home/ayaneru/base
RUN cd base && npm i -S 
# now we launch the bot
RUN node bot --harmony
ENV LANG en_GB.UTF-8
ENV LANG en_US.UTF-8
CMD tail -f /dev/null
EXPOSE 22 8080
