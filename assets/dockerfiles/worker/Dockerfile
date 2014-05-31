#worker
FROM ubuntu:saucy

MAINTAINER Levi

RUN apt-get update; apt-get install software-properties-common -y

RUN add-apt-repository -y ppa:couchdb/stable
RUN add-apt-repository -y ppa:chris-lea/node.js

# Update again!
RUN apt-get update

RUN apt-get install -y build-essential libcurl4-gnutls-dev libexpat1-dev gettext libz-dev libssl-dev git ruby-full rubygems nodejs couchdb python g++ curl

RUN npm install grunt-cli mocha bower -g

RUN mkdir -p /root/.ssh
ADD ./assets/build/id_rsa /root/.ssh/id_rsa
RUN chmod 700 /root/.ssh/id_rsa
RUN echo "Host github.com\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config

# Pull project
RUN git clone git@github.com:codeswarm/docker-shim.git /home/codeswarm

VOLUME[".:/data"]

FROM /data RUN npm install

RUN echo "Installing Compass"
RUN gem install compass breakpoint sass --no-ri --no-rdoc
#RUN gem install breakpoint --no-ri --no-rdoc
#RUN gem install sass --no-ri --no-rdoc

RUN echo "Configuring the local Vagrant user"
ADD assets/build/.bashrc /home/vagrant/.bashrc
ADD assets/build/local.ini /etc/couchdb/local.ini

# Ensure CouchDB is started
RUN service couchdb restart

CMD["npm"]