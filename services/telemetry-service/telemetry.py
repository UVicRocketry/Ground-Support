#!/usr/bin/env python
import os
import sys
import shutil
from subprocess import Popen, PIPE, run

currentData = {
    "Position": "",
    "N": "",
    "W": "",
    "alt": ""
}
while True:
    for line in sys.stdin:
        if "Position" in line:
            currentData["Position"] = line[10:]
            currentData["Position"] = currentData["Position"][0:-1]
        if "N " in line:
            currentData["N"] = line[2:12]
        if "W " in line:
            currentData["W"] = line[14:25]
        if "alt " in line:
            currentData["alt"] = line[33:]
            currentData["alt"] = currentData["alt"][0:-4]
        if "Invalid character in compressed longitude" in line:
            print("error: GPS is not locked")
        # API CALL (Yay!)
