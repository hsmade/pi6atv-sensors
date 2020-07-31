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
        # FIXME implement
        return value

    def read(self) -> bool:
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

