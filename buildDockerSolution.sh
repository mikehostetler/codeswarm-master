#!/bin/bash

DEBUG=0
BASEDIR=$(cd $(dirname $0); pwd)
buildname="codeswarm-main"
buildver="0.0.1"

source ./bin/deploy.sh

docker=$(which docker)
VOLUME_MAP="-v ./:/data "

echo $docker

checkRoot

if type "$docker" > /dev/null; then
    echo "Building Master"
    docker build -t $buildname:$buildver assets/dockerfiles/master/
    echo "Master Built"
else
    echo "please install Docker, on debian: apt-get install docker || redhat/centos: yum install docker-io || Mac: http://docs.docker.io/installation/mac/"
    if [ "$(uname)" == "Darwin" ]; then
        open http://docs.docker.io/installation/mac/
    fi
fi


