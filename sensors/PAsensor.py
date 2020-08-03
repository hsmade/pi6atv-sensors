from .BaseSensor import BaseSensor
import board
import logging

LOG = logging.getLogger(__name__)


class PASensor(BaseSensor):
    """
    PA sensor, returns the PA power based on the value of a GPIO pin

    :param gpio_pin: The pin to read from
    """
    type = "pa_power"

    def __init__(self, name, i2c_address, maximum: int, minimum: int):
        super().__init__(name)
        self.i2c_address = i2c_address
        self.maximum = maximum
        self.minimum = minimum

    def map(self, value: int):
        """
        Maps the read value to actual power
        :param value:
        :return: float
        """
        mapping = {
            # value: power
            0.09: 0.1,    # 0.09V
            0.1: 0.2,  # 0.1
            0.15: 0.3, # 0.15
            0.2: 0.4,  # 0.2
            0.3: 0.5,  # 0.3
            0.5: 1,    # 0.5
            0.6: 1.5,  # 0.6
            0.7: 2,    # 0.7
            50: 2.5,  # 0.8
            55: 3,    # 0.9
            63: 3.5,    # 1.0
            67: 4,    # 1.1
            74: 4.5,  # 1.2
            80: 5,    # 1.3
            84: 5.5,  # 1.4
            92: 6,   # 1.55
            98: 6.5,  # 1.6
            102: 7,   # 1.65
            104: 7.5,  # 1.7
            110: 8,    # 1.8
            117: 8.5,  # 1.9
            123: 9,      # 2
            129: 9.5, # 2.11
            134: 10,   # 2.2
            140: 10.5, # 2.3
            148: 11,   # 2.4
            153: 11.5,   # 2.5
            149: 12,   # 2.6
            165: 12.5,   # 2.7
            172: 13,   # 2.8
            178: 13.5,   # 2.9
        }
        result = 0
        for volt, power in mapping.items():
            if value >= volt:
                result = power
            else:
                break
        return result

    def read(self) -> float:
        """
        reads from the sensor and returns the state
        :return: bool
        """
        i2c = board.I2C()
        buffer = bytearray(1)
        i2c.readfrom_into(self.i2c_address, buffer)
        value = int.from_bytes(buffer, byteorder='big')
        LOG.debug("{} has value: {}".format(self.name, value))
        return self.map(value)

    def to_dict(self):
        value = self.read()
        return {
            "name": self.name,
            "type": self.type,
            "value": value,
            "max": self.maximum,
            "min": self.minimum,
            "prometheus_data": self.to_openmetrics(value),
        }
