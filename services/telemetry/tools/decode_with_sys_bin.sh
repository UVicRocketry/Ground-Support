#!/usr/bin/env sh

# This script is used to decode APRS packets from the RTL-SDR dongle
#
# This version is for using system-wide binaries instead of in the repo.

if [ $# -ge 1 ]
then
  FREQ=$1
else
  FREQ=433.92M
fi

rtl_fm -f $FREQ -r 24k -s 260k -o 4 -p 93 -g 49.6 - | direwolf -c ./tools/direwolf.conf -n 1 -r 24000 -b 16 -
