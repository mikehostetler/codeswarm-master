#!/bin/bash

echo "Updating package lists"

export DEBIAN_FRONTEND=noninteractive

# Add Keys for Docker
sh -c 'echo deb http://get.docker.io/ubuntu docker main' > /etc/apt/sources.list.d/docker.list
apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 36A1D7869245C8950F966E92D8576A8BA88D21E9

# Lets get the ball rolling
apt-get update
apt-get upgrade -y
apt-get install -y python-software-properties

# Add PPA for CouchDB and Node.js, these must come after installing python-software-properties
add-apt-repository -y ppa:couchdb/stable
add-apt-repository -y ppa:chris-lea/node.js

# Update again!
apt-get update

apt-get install -y build-essential libcurl4-gnutls-dev libexpat1-dev gettext libz-dev libssl-dev git ruby-full rubygems nodejs couchdb python g++ curl
apt-get install -y linux-image-generic-lts-raring linux-headers-generic-lts-raring
apt-get install -y lxc-docker


npm install grunt-cli -g
npm install mocha -g
npm install bower -g

# Install NPM modules
echo "Install project's node_modules"
cd /vagrant
sudo chown vagrant:vagrant /vagrant -R
npm install

echo "Installing Compass"
gem install compass --no-ri --no-rdoc
gem install breakpoint --no-ri --no-rdoc
gem install sass --no-ri --no-rdoc

echo "Configuring the local Vagrant user"
cat >/home/vagrant/.bashrc <<EOL
set -o vi
alias l="ls -alF"
cd /vagrant
EOL
#[ -s "/usr/local/nvm/nvm.sh" ] && . "/usr/local/nvm/nvm.sh" # This loads nvm
#nvm use v0.10.28 # Use latest version

# Edit the CouchDB Local.ini file
sed -i.bak 's/;bind_address = 127.0.0.1/bind_address = 0.0.0.0/g' /etc/couchdb/local.ini
sed -i.bak 's/;admin = mysecretpassword/admin = admin/g' /etc/couchdb/local.ini

# Ensure CouchDB is started
service couchdb restart

# Run an NPM install again just to make sure
cd /vagrant
npm install
