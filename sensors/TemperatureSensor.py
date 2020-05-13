import re
import logging
from time import sleep
from typing import Union


class DS18B20TemperatureSensor:
    """
    DS18B20 temperature sensor

    :param path: example: 28-00348a000019
    :param retries: how many times to try to read the sensor before giving up
    """

    def __init__(self, path: str, retries=10):
        self.path = path
        self.retries = retries

    def _read_from_sensor(self) -> Union[str, None]:
        tries = 0
        while tries < self.retries:
            tries -= 1
            with open("/sys/bus/w1/devices/{}}/w1_slave".format(self.path), "r") as w1:
                data = w1.read()
            if re.match("YES", data):
                return data
            sleep(0.2)
        logging.error("failed to read from sensor {}, tried {} times".format(self.path, self.retries))
        return None

    def read(self) -> Union[float, None]:
        """
        reads from the sensor and returns the state
        :return: float
        """
        data = self._read_from_sensor()
        if not data:
            logging.error("did not receive any data from sensor {}".format(self.path))
            return None

        try:
            return float(re.search("t=([0-9]+)$", data).group(1)) / 1000.0
        except Exception as e:
            logging.error("caught exception when reading from sensor {}: {}".format(self.path, e))
            return None
