#!/bin/bash

apt-get update
apt-get upgrade -y
apt-get install -y python-software-properties
add-apt-repository -y ppa:couchdb/stable

echo "Updating package lists"
apt-get update
apt-get upgrade -y

echo "Installing dependencies"
apt-get install -y build-essential libcurl4-gnutls-dev libexpat1-dev gettext libz-dev libssl-dev git ruby-full rubygems couchdb python g++ curl

echo "Installing the Node Version Manager"
curl https://raw.githubusercontent.com/creationix/nvm/v0.7.0/install.sh | NVM_DIR=/usr/local/nvm sh
chmod 777 -R /usr/local/nvm 

source ~/.profile
nvm install v0.10.28
nvm use v0.10.28

npm install grunt-cli -g
npm install nodemon -g
npm install mocha -g

echo "Installing Compass"
gem install compass --no-ri --no-rdoc
gem install breakpoint --no-ri --no-rdoc
gem install sass --no-ri --no-rdoc

npm set bin-links false

# Edit Vagrant user profile
cat >/home/vagrant/.bashrc <<EOL
set -o vi
alias l="ls -alF"
cd /vagrant
[ -s "/usr/local/nvm/nvm.sh" ] && . "/usr/local/nvm/nvm.sh" # This loads nvm
nvm use v0.10.28 # Use latest version
EOL

# Edit the CouchDB Local.ini file
sed -i.bak 's/;bind_address = 127.0.0.1/bind_address = 0.0.0.0/g' /etc/couchdb/local.ini
sed -i.bak 's/;admin = mysecretpassword/admin = admin/g' /etc/couchdb/local.ini

# Ensure CouchDB is started
start couchdb

# Unpack config archive and set up
if [ ! -f /vagrant/vagrant.tar.gz ]; then
    echo "No config package found";
    exit;
fi

tar -xzvf /vagrant/vagrant.tar.gz -C /tmp

if [ ! -f /tmp/vagrant/install.sh ]; then
    echo "No config installation script found";
    exit;
fi

cd /tmp/vagrant
sh install.sh
