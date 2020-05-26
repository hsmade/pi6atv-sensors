#!/bin/bash
cd $(dirname $0)
. deb.env

version=$(git describe --tags)
GIT_COMMIT=$(git describe --tags)
GIT_DIRTY=$(if git status --porcelain),+CHANGES)
mkdir -p build/opt/repeater-sensors
cp -r sensors *.py README.md requirements.txt build/opt/repeater-sensors/
cp -r react-web/build build/opt/repeater-sensors/web
cd build
dpkg-deb -b . ../repeater-sensors.deb