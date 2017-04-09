# Clara -Dockerfile
# This is a highly experimental Dockerfile. Use with caution.
# Licensed Under MIT. Contributed by Capuccino

FROM node:boron

RUN echo "force-unsafe-io" > /etc/dpkg/dpkg.cfg.d/02apt-speedup
RUN echo "Acquire::http {No-Cache=True;};" > /etc/apt/apt.conf.d/no-cache

RUN adduser --disabled-password --gecos "" clara && adduser clara sudo && su clara
WORKDIR /home/clara

#We're gonna add a pseudo-user here
RUN git config --global user.name nyan && git config --global user.email nyan@pa.su

COPY . . 

# Install deps
RUN npm i --silent

RUN echo "deb http://download.rethinkdb.com/apt `lsb_release -cs` main" | sudo tee /etc/apt/sources.list.d/rethinkdb.list && \
   wget -qO- https://download.rethinkdb.com/apt/pubkey.gpg | sudo apt-key add - && \
   apt-get update && \
   apt-get install rethinkdb \


#Expose Local port and SSH Port just because we can

EXPOSE 22 8080

ENTRYPOINT ["node", "~/src/bot.js"]

# We should echo this if build succeeds

RUN echo "Senpai it worked!"
