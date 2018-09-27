###INFO###
#Script to simulate physical sensors - which we do not have. 
#Used FOR DEMONSTRATION PURPOSE ONLY, script is not neccessary for real-life application.
###INFO###

#import modules to send requests
import requests
import random


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
    def trigger(inOut, functName, storeID):
        try:
            data = { funct: functName, storeID: storeID, floor: floorNum, inOrOut: inOut }
            r = requests.get('https://zeno.computing.dundee.ac.uk/2018-projects/team5/backend_functions.php', params = data) #auth here if needed
            print(r)
        except Exception as e:
            print(e)


#class for stores
class Store:
    def __init__(self, storeID):
        inSensor = Sensor(storeID, 1)
        outSensor = Sensor(storeID, 0)



#building overgate (stores+sensors)
arr = []
for each in range(62):
    store = Store(each)
    arr.append(store)

    
#simulating real-time events with randomized input on sensors in an infinite loop
def loop():
    number = random.randint(3, 50)
        for each in range(number):
            iO = random.randint(0,1)
            if (iO==0):
                arr[each].outSensor.trigger(iO, "storeTrackerEnterRecord", arr[each].storeID)
            else:
                arr[each].inSensor.trigger(iO, "storeTrackerEnterRecord", arr[each].storeID)

while(True):
    try:
        loop()
    except Exception as e:
        print(e)




