import adafruit_ina260
import board
from .BaseSensor import BaseSensor


class INA260Sensor(BaseSensor):
    """
    INA260 voltage, current and power sensor

    :param address: the i2c addres (default: 0x40)
    """
    type = "power"

    def __init__(self, name, address=0x040, min_current=-1, max_current=99999, min_voltage=11500, max_voltage=12500, sort=0):
        super().__init__(name)
        self.address = address
        self.min_current = min_current
        self.max_current = max_current
        self.min_voltage = min_voltage
        self.max_voltage = max_voltage
        self.sort = sort


    def read(self) -> dict:
        """
        returns a dict with power, current and voltage as keys and int values
        :return: dict
        """
        i2c = board.I2C()
        ina260 = adafruit_ina260.INA260(i2c, address=self.address)
        ina260.mode = adafruit_ina260.Mode.CONTINUOUS
        ina260.averaging_count = adafruit_ina260.AveragingCount.COUNT_4
        return {
            "power": ina260.power, "current": ina260.current, "voltage": ina260.voltage,
            "min_current": self.min_current, "max_current": self.max_current,
            "min_voltage": self.min_voltage, "max_voltage": self.max_voltage,
        }

    def to_openmetrics(self, data):
        result = 'power{{name="{name}", class="{class_name}"}} {value}\n'.format(type=self.type, class_name=type(self).__name__.lower(), name=self.name, value=data['power'])
        result += 'voltage{{name="{name}", class="{class_name}"}} {value}\n'.format(type=self.type, class_name=type(self).__name__.lower(), name=self.name, value=data['voltage'])
        result += 'current{{name="{name}", class="{class_name}"}} {value}\n'.format(type=self.type, class_name=type(self).__name__.lower(), name=self.name, value=data['current'])
        return result
