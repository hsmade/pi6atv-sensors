import RPi.GPIO as GPIO
from .BaseSensor import BaseSensor
import logging


class PASensor(BaseSensor):
    """
    PA sensor, returns the PA power based on the value of a GPIO pin

    :param gpio_pin: The pin to read from
    """
    type = "pa_power"

    def __init__(self, name, gpio_pin: int, maximum: int, minimum: int):
        super().__init__(name)
        self.gpio_pin = gpio_pin
        self.maximum = maximum
        self.minimum = minimum

    def map(self, value: float):
        """
        Maps the read value to actual power
        :param value:
        :return: float
        """
        mapping = {
            # voltage: power
            0.09: 0.1,
            0.1: 0.2,
            0.15: 0.3,
            0.2: 0.4,
            0.3: 0.5,
            0.5: 1,
            0.6: 1.5,
            0.7: 2,
            0.8: 2.5,
            0.9: 3,
            1: 3.5,
            1.1: 4,
            1.2: 4.5,
            1.3: 5,
            1.4: 5.5,
            1.55: 6,
            1.6: 6.5,
            1.65: 7,
            1.7: 7.5,
            1.8: 8,
            1.9: 8.5,
            2: 9,
            2.11: 9.5,
            2.2: 10,
            2.3: 10.5,
            2.4: 11,
        }
        # FIXME implement
        result = 0
        for volt, power in mapping.items():
            if value > volt:
                result = volt
        return result

    def read(self) -> float:
        """
        reads from the sensor and returns the state
        :return: bool
        """
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.gpio_pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
        value = GPIO.input(self.gpio_pin)
        logging.debug("{} has value: {}".format(self.name, value))
        return self.map(value)

    def to_openmetrics(self, bool_value):
        value = 1 if bool_value else 0
        return '{type}{{name="{name}", class="{class_name}"}} {value}\n'.format(type=self.type, class_name=type(self).__name__.lower(), name=self.name, value=value)

