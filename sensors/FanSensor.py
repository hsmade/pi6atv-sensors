import RPi.GPIO as GPIO
import time
from .BaseSensor import BaseSensor
from collections import deque
import logging

logging.basicConfig(level="DEBUG")


class FanSensor(BaseSensor):
    """
    Calculates Fan RPM from pulses on GPIO

    :param gpio_pin: the GPIO pin to read from
    :param timeout: the maximum time to wait for the amount of samples to come in
    """
    PULSE = 2       # Noctua fans puts out two pluses per revolution
    type = "rpm"

    def __init__(self, name, gpio_pin: int, timeout=2, minimum=0, maximum=65535):
        super().__init__(name)
        self.gpio_pin = gpio_pin
        self.timeout = timeout
        self.minimum = minimum
        self.maximum = maximum
        self.timer = time.time()
        self.filtered_ticks = 0

    def read(self) -> int:
        """
        samples the GPIO for the given amount of seconds and returns the RPM
        :return: int
        """
        start = time.time()
        try:
            self.timer = start
            self.filtered_ticks = 0
            GPIO.setmode(GPIO.BCM)
            GPIO.setwarnings(False)
            GPIO.setup(self.gpio_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)  # Pull up to 3.3V
            GPIO.add_event_detect(self.gpio_pin, GPIO.RISING, self._handle_event)

            time.sleep(self.timeout)
        except Exception as e:
            logging.error("Fan {} failed reading from sensor: {}".format(self.name, e))
            GPIO.cleanup()  # at least do the cleanup on failure, or we'll keep failing
            return -1

        GPIO.cleanup()
        time_diff = time.time() - start
        logging.debug("Fan {}: cleaning up".format(self.name))

        if self.filtered_ticks < 1:
            logging.error("Fan {} Did not register any pulses".format(self.name))
            return -1

        logging.debug("Fan {}: calculating rpm".format(self.name))
        rpm = (self.filtered_ticks / self.PULSE / time_diff) * 60

        return int(rpm)

    def _handle_event(self, _):
        # logging.debug("Fan {}: got event".format(self.name))
        time_delta = time.time() - self.timer
        self.timer = time.time()
        if time_delta < 0.005:
            return  # Reject spuriously short pulses
        self.filtered_ticks += 1

    def to_dict(self):
        value = self.read()
        return {
            "name": self.name,
            "type": self.type,
            "min": self.minimum,
            "max": self.maximum,
            "value": value,
            "prometheus_data": self.to_openmetrics(value),
        }
