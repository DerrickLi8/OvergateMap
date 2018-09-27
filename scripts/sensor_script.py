###INFO###
#Script to simulate physical sensors - which we do not have. 
#Used FOR DEMONSTRATION PURPOSE ONLY, script is not neccessary for real-life application.
###INFO###

#import modules to send requests
import requests
import random
from datetime import time, date
import json


#class for sensors
class Sensor:
    #function to initialize the sensor
        #type of sensor(in or out) is defined by var "inOut"
        #store/floor/complex it belongs to is in var "storeID"
    def __init__(self, storeID, inOut):
        self.storeID = storeID
        self.inOut = inOut

    #function to call when sensor is triggered
    #sends reqest to php backend to add person to database or remove person from database
    def trigger(self, inOut, storeID):
        try:
            data = { "funct":"storeTrackerCreate", "storeID": storeID, "inOrOut": inOut }
            r = requests.post('https://zeno.computing.dundee.ac.uk/2018-projects/team5/backend_functions.php', params=data)
            print(r.url)
        except Exception as e:
            print(e)


#class for stores
class Store:
    def __init__(self, storeID):
        self.storeID = storeID
        self.inSensor = Sensor(storeID, 1)
        self.outSensor = Sensor(storeID, 0)
        self.counter = 0



#building overgate (stores+sensors)
arr = []
for each in range(68):
    arr.append(Store(each))
    print(arr[each].storeID, "baszod")

    
#simulating real-time events with randomized input on sensors in an infinite loop
def loop():
    print("loop started")
    number = random.randint(3, 60)
    for each in range(number):
        iO = random.randint(0,1)
        print(iO)
        if (iO == 0):
            print("wut")
            if(arr[each].counter >1):
                print("storeID: ", arr[each].storeID)
                arr[each].outSensor.trigger(iO, arr[each].storeID)
                arr[each].counter -= 1
        elif (iO == 1):
            print("what")
            a = arr[each].storeID
            arr[each].inSensor.trigger(iO, arr[each].storeID)
            arr[each].counter += 1

while(True):
    try:
        loop()
    except Exception as e:
        print(e)




