from multiprocessing import Manager, Process
from sensors import sensor_config
import ctypes
from time import sleep
import json
from shutil import move
import logging

sensor_values = list()

sensor_type_to_data_type = {
    "temperature": ctypes.c_float,
    "RPM": ctypes.c_int,
    "bool": ctypes.c_bool,
}

processes = list()
COMPLEX_TYPES = ["dht22"]

logging.basicConfig(level="DEBUG")


def scraper(sensor, storage):
    while True:
        data = sensor.toDict()
        print("found value {} for {}".format(data["value"], data["name"]))
        for key, value in data.items():
            storage[key] = value
        sleep(1)


def main():
    for sensor in sensor_config:
        d = Manager().dict()
        sensor_values.append(d)

        p = Process(target=scraper, args=(sensor, d))
        processes.append(p)
        p.start()

    while True:
        result = list()
        for sensor_value in sensor_values:
            result.append(sensor_value.copy())
        with open("web/sensors.json.new", "w") as json_file:
            json.dump(result, json_file)
            print(result)
        move("web/sensors.json.new", "web/sensors.json")
        sleep(1)


if __name__ == "__main__":
    main()
