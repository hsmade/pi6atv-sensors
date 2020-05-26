import adafruit_ina260
import board
from .BaseSensor import BaseSensor


class INA260Sensor(BaseSensor):
    """
    INA260 voltage, current and power sensor

    :param address: the i2c addres (default: 0x40)
    """
    type = "power"

    def __init__(self, name, address=0x040):
        super().__init__(name)
        self.address = address

    def read(self) -> dict:
        """
        returns a dict with power, current and voltage as keys and int values
        :return: dict
        """
        i2c = board.I2C()
        ina260 = adafruit_ina260.INA260(i2c, address=self.address)
        ina260.mode = adafruit_ina260.Mode.CONTINUOUS
        ina260.averaging_count = adafruit_ina260.AveragingCount.COUNT_4
        return {"power": ina260.power, "current": ina260.current, "voltage": ina260.voltage}

    def to_openmetrics(self):
        data = self.read()
        result = 'power{{name="{name}", class="{class_name}"}} {value}\n'.format(type=self.type, class_name=type(self).__name__.lower(), name=self.name, value=data['power'])
        result += 'voltage{{name="{name}", class="{class_name}"}} {value}\n'.format(type=self.type, class_name=type(self).__name__.lower(), name=self.name, value=data['voltage'])
        result += 'current{{name="{name}", class="{class_name}"}} {value}\n'.format(type=self.type, class_name=type(self).__name__.lower(), name=self.name, value=data['current'])
        return result
