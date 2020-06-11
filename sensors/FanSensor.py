import RPi.GPIO as GPIO
import time
from .BaseSensor import BaseSensor
import logging
import os
from multiprocessing import Queue, Process

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
        ret = Queue()

        p = Process(target=self.read, args=(ret, ))
        p.start()
        p.join()
        return ret.get()

    def do_read(self, queue) -> int:
        """
        samples the GPIO for the given amount of seconds and returns the RPM
        :return: int
        """
        logging.debug("Fan {}: PID: {}".format(self.name, os.getpid()))
        start = time.time()
        try:
            self.timer = start
            self.filtered_ticks = 0
            logging.debug("Fan {}: -- setmode".format(self.name))
            GPIO.setmode(GPIO.BCM)
            # logging.debug("Fan {}: -- setwarnings".format(self.name))
            GPIO.setwarnings(False)
            # logging.debug("Fan {}: -- setup".format(self.name))
            GPIO.setup(self.gpio_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)  # Pull up to 3.3V
            # logging.debug("Fan {}: -- remove_event_detect".format(self.name))
            GPIO.remove_event_detect(self.gpio_pin)
            # logging.debug("Fan {}: -- add_event_detect".format(self.name))
            GPIO.add_event_detect(self.gpio_pin, GPIO.RISING, self._handle_event)

            logging.debug("Fan {}: -- sleep".format(self.name))
            time.sleep(self.timeout)
        except Exception as e:
            logging.error("Fan {} failed reading from sensor: {}".format(self.name, e))
            # logging.debug("Fan {}: -- cleanup".format(self.name))
            GPIO.cleanup()  # at least do the cleanup on failure, or we'll keep failing
            queue.put(-1)
            return -1

        logging.debug("Fan {}: -- cleanup".format(self.name))
        GPIO.cleanup()
        time_diff = time.time() - start

        if self.filtered_ticks < 1:
            logging.error("Fan {} Did not register any pulses".format(self.name))
            queue.put(-1)
            return -1

        logging.debug("Fan {}: calculating rpm".format(self.name))
        rpm = (self.filtered_ticks / self.PULSE / time_diff) * 60

        queue.put(int(rpm))
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
