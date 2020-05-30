import RPi.GPIO as GPIO
from .BaseSensor import BaseSensor
import logging


class BooleanSensor(BaseSensor):
    """
    Boolean sensor, returns the state of a GPIO pin

    :param gpio_pin: The pin to read from
    """
    type = "status"

    def __init__(self, name, gpio_pin: int):
        super().__init__(name)
        self.gpio_pin = gpio_pin

    def read(self) -> bool:
        """
        reads from the sensor and returns the state
        :return: bool
        """
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.gpio_pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
        value = GPIO.input(self.gpio_pin)
        # logging.debug("{} has value: {}".format(self.name, value))
        return value != 0

    def to_openmetrics(self, bool_value):
        value = 1 if bool_value else 0
        return '{type}{{name="{name}", class="{class_name}"}} {value}\n'.format(type=self.type, class_name=type(self).__name__.lower(), name=self.name, value=value)


class ReverseBooleanSensor(BaseSensor):
    """
    Reverse Boolean sensor, returns the opposite of the state of a GPIO pin

    :param gpio_pin: The pin to read from
    """
    type = "reverse_status"

    def __init__(self, name, gpio_pin: int):
        super().__init__(name)
        self.gpio_pin = gpio_pin

    def read(self) -> bool:
        """
        reads from the sensor and returns the state
        :return: bool
        """
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.gpio_pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
        value = GPIO.input(self.gpio_pin)
        return value != 1

    def to_openmetrics(self, bool_value):
        value = 1 if bool_value else 0
        return '{type}{{name="{name}", class="{class_name}"}} {value}\n'.format(type=self.type, class_name=type(self).__name__.lower(), name=self.name, value=value)
