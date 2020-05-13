import adafruit_ina260
import board


class INA260Sensor:
    """
    INA260 voltage, current and power sensor
    """

    def __init__(self):
        i2c = board.I2C()
        self.ina260 = adafruit_ina260.INA260(i2c)
        self.ina260.mode = adafruit_ina260.Mode.CONTINUOUS
        self.ina260.averaging_count = adafruit_ina260.AveragingCount.COUNT_4

    def read(self):
        """
        returns a dict with power, current and voltage as keys and int values
        :return: dict
        """
        return {"power": self.ina260.power, "current": self.ina260.current, "voltage": self.ina260.voltage}
