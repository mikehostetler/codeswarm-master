#master
FROM ubuntu:saucy

MAINTAINER Levi

RUN apt-get update; apt-get install software-properties-common nodejs npm couchdb -y

#RUN add-apt-repository -y ppa:couchdb/stable
#RUN add-apt-repository -y ppa:chris-lea/node.js

RUN apt-get update

RUN apt-get install -y build-essential libcurl4-gnutls-dev libexpat1-dev gettext libz-dev libssl-dev git ruby-full rubygems nodejs couchdb python g++ curl

RUN npm install grunt-cli mocha bower -g

VOLUME["/home/th3m4d0n3/NetBeansProjects/codeswarm-master/assets/:/data"]

RUN ls -alh /data

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