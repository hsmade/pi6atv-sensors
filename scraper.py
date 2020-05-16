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

logging.basicConfig(level="DEBUG")


def scraper(sensor, dict_storage):
    while True:
        try:
            data = sensor.to_dict()
            logging.debug("found value {} for {}".format(data["value"], data["name"]))
            for key, value in data.items():
                dict_storage[key] = value
        except Exception as e:
            logging.error("Failed to load data for sensor {}: {}".format(sensor.name, e))
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
        prom_data = ""
        for sensor_value in sensor_values:
            result.append(sensor_value.copy())
            try:
                prom_data += sensor_value.get("prometheus_data", "")
            except Exception as e:
                logging.error("failed to add prometheus data: {} with error: {}", sensor_value.get("prometheus_data"), e)

        with open("/dev/shm/sensors.json.new", "w") as json_file:
            json.dump(result, json_file)
            logging.debug(result)
        move("/dev/shm/sensors.json.new", "/dev/shm/sensors.json")

        with open("/dev/shm/sensors.prometheus.new", "w") as prom_file:
            prom_file.write(prom_data)
        move("/dev/shm/sensors.prometheus.new", "/dev/shm/sensors.prometheus")

        sleep(1)


if __name__ == "__main__":
    main()
