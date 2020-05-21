import RPi.GPIO as GPIO
import time
from .BaseSensor import BaseSensor
import logging

logging.basicConfig(level="DEBUG")


class FLowSensor(BaseSensor):
    """
    Calculates flow from pulses on GPIO

    :param gpio_pin: the GPIO pin to read from
    :param timeout: The time to sample for (1s)
    """
    type = "flow"

    def __init__(self, name, gpio_pin: int, timeout=1, minimum=0, maximum=65535, red_from=None):
        super().__init__(name)
        self.gpio_pin = gpio_pin
        self.timeout = timeout
        self.minimum = minimum
        self.maximum = maximum
        self.red_from = red_from
        self.timer = time.time()
        self.pulses = 0

    def read(self) -> float:
        """
        samples the GPIO for the given amount of seconds and returns the Flow in L/min
        :return: float
        """
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(self.gpio_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)  # Pull up to 3.3V
        self.pulses = 0
        self.timer = time.time() + self.timeout
        GPIO.add_event_detect(self.gpio_pin, GPIO.RISING, self._handle_event)

        time.sleep(self.timeout)
        result = (self.pulses * (60/self.timeout) * 2.25 / 1000)
        GPIO.cleanup()

        return result

    def _handle_event(self, _):
        if self.timer < time.time():
            self.pulses += 1

    def to_dict(self):
        return {
            "name": self.name,
            "type": self.type,
            "min": self.minimum,
            "max": self.maximum,
            "redFrom": self.red_from,
            "value": self.read(),
            "prometheus_data": self.to_openmetrics(),
        }