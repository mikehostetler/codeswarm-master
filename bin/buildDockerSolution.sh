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

buildMaster

buildWorker


