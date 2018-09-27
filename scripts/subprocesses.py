###INFO###
#Used FOR DEMONSTRATION PURPOSE ONLY, script is not neccessary for real-life application.
###INFO###

#used for simulating the fast-paced environment of overgate by running more than one instance of the sensorscript

import sys
import subprocess

sensorscripts = []

for i in range(5):
    sscript = subprocess.Popen([sys.executable, 'sensor_script.py'])
    sensorscripts.append(sscript)

for each in sensorscripts:
    each.wait()