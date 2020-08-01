import re
import logging
from time import sleep
from typing import Union
from .BaseSensor import BaseSensor

LOG = logging.getLogger(__name__)


class DS18B20TemperatureSensor(BaseSensor):
    """
    DS18B20 temperature sensor

    :param path: example: 28-00348a000019
    :param retries: how many times to try to read the sensor before giving up
    """
    type = "temperature"
    PATH = "/sys/bus/w1/devices/{}/w1_slave"

    def __init__(self, name, path: str, retries=10, sort=0):
        super().__init__(name)
        self.path = path
        self.retries = retries
        self.sort = sort

    def _read_from_sensor(self) -> Union[str, None]:
        tries = 0
        while tries < self.retries:
            tries -= 1
            with open(self.PATH.format(self.path), "r") as w1:
                data = w1.read()
                LOG.info("Got data: {} from sensor {}".format(data, self.path))
            if "YES" in data and not data.endswith("t=0\n"):
                return data
            LOG.debug("waiting for valid data from sensor {}".format(self.path))
            sleep(0.2)
        LOG.error("failed to read from sensor {}, tried {} times".format(self.path, self.retries))
        return None

    def to_dict(self):
        value = self.read()
        return {
            "name": self.name,
            "type": self.type,
            "value": value,
            "sort": self.sort,
            "prometheus_data": self.to_openmetrics(value),
        }

    def read(self) -> Union[float, None]:
        """
        reads from the sensor and returns the state
        :return: float
        """
        data = self._read_from_sensor()
        if not data:
            LOG.error("did not receive any data from sensor {}".format(self.path))
            return None

        try:
            return float(re.search("t=([0-9]+)$", data).group(1)) / 1000.0
        except Exception as e:
            LOG.error("caught exception when reading from sensor {}: {}".format(self.path, e))
            return None


class DHT22TemperatureSensor(BaseSensor):
    """
        DHT22 temperature sensor

        :param path: the device path to read from
    """

    type = "dht22"

    def __init__(self, name, path: str):
        super().__init__(name)
        if not path.endswith("/"):
            path = path + "/"
        self.path = path

    def read(self) -> Union[dict, None]:
        """
        returns a dict with the keys temperature and humidity and floats as values or None in case of failure
        :return:
        """
        humidity, temperature = [-255, -255]
        for attempt in range(1, 4):
            try:
                with open(self.path + "in_temp_input") as dev:
                    temperature = int(dev.read()) / 1000
            except:
                LOG.error("failed to read temperature data from DHT22 on path {}: t={} attempt={}".format(self.path, temperature, attempt))
            else:
                continue
        for attempt in range(1, 4):
            try:
                with open(self.path + "in_humidityrelative_input") as dev:
                    humidity = int(dev.read()) / 1000
            except:
                LOG.error("failed to read humidity data from DHT22 on path {}: h={} attempt={}".format(self.path, humidity, attempt))
            else:
                continue

        return {"temperature": temperature, "humidity": humidity}

    def to_openmetrics(self, data):
        if not data:
            return ""
        result = 'temperature{{name="{name}", class="{class_name}"}} {value}\n'.format(type=self.type, class_name=type(self).__name__.lower(), name=self.name, value=data.get("temperature"))
        result += 'humidity{{name="{name}", class="{class_name}"}} {value}\n'.format(type=self.type, class_name=type(self).__name__.lower(), name=self.name, value=data.get("humidity"))
        return result
