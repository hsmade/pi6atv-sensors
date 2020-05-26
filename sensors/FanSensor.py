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
    :param samples: the amount of samples to average over
    :param timeout: the maximum time to wait for the amount of samples to come in
    """
    PULSE = 2       # Noctua fans puts out two pluses per revolution
    type = "rpm"

    def __init__(self, name, gpio_pin: int, samples=10, timeout=2, minimum=0, maximum=65535):
        super().__init__(name)
        self.gpio_pin = gpio_pin
        self.samples = samples
        self.timeout = timeout
        self.minimum = minimum
        self.maximum = maximum
        self.timer = time.time()
        self.rpms = deque(maxlen=samples)

    def read(self) -> int:
        """
        samples the GPIO for the given amount of seconds and returns the RPM
        :return: int
        """
        start = time.time()
        self.rpms = deque(maxlen=self.samples)
        self.timer = start
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(self.gpio_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)  # Pull up to 3.3V
        GPIO.add_event_detect(self.gpio_pin, GPIO.RISING, self._handle_event)

        time.sleep(self.timeout)

        GPIO.cleanup()

        if len(self.rpms) < 1:
            logging.error("Did not get any data from fan {}".format(self.name))
            return -1

        try:
            average = sum(self.rpms) / len(self.rpms)
            return int(average)
        except Exception as e:
            logging.error("Failed to calculate average for fan {}: {}".format(self.name, e))
            return -1

    def _handle_event(self, _):
        time_delta = time.time() - self.timer
        if time_delta < 0.005:
            return  # Reject spuriously short pulses

        frequency = 1 / time_delta
        rpm = (frequency / self.PULSE) * 60
        # logging.debug("got event for fan: {}, td={} rpm={}".format(self.name, time_delta, rpm))
        self.rpms.append(rpm)
        # logging.debug("fan: {} _handle_event: rpms: {}".format(self.name, len(self.rpms)))
        self.timer = time.time()

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
