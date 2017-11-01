#!/bin/bash

function show_help() {
  echo "$0 build"
  echo "$0 install"
  echo "$0 run dev"
  echo "$0 run build"
}

if [ $# -lt 1 ]; then
  show_help
  exit 0
fi

set -e

cd "`dirname $0`"

if [ -z "$DOCKER_IT" ] && [ "${DOCKER_IT:-A}" = "${DOCKER_IT-A}" ]; then
  DOCKER_IT="-it"
fi

case "$1" in
  "build" ) docker build -t kunai:0.0.0-alpine docker ;;
  "install" ) docker run -v `pwd`:/var/src -p 8080:8080 $DOCKER_IT kunai:0.0.0-alpine /bin/sh -c "cd /var/src && exec npm install" ;;
  "run" )
    if [ $# -lt 2 ]; then
      show_help
      exit 1
    fi
    docker run -v `pwd`:/var/src -p 8080:8080 $DOCKER_IT kunai:0.0.0-alpine /bin/sh -c "cd /var/src && exec npm run $2" ;;
  * )
    show_help
    exit 1 ;;
esac
