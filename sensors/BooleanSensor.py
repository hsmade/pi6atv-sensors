import RPi.GPIO as GPIO
from .BaseSensor import BaseSensor

class BooleanSensor(BaseSensor):
    """
    Boolean sensor, returns the state of a GPIO pin

    :param gpio_pin: The pin to read from
    """
    type = "bool"

    def __init__(self, name, gpio_pin: int):
        super().__init__(name)
        self.gpio_pin = gpio_pin
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(gpio_pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

    def read(self) -> bool:
        """
        reads from the sensor and returns the state
        :return: bool
        """
        return GPIO.input(self.gpio_pin) != 0
