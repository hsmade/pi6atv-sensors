import RPi.GPIO as GPIO
import time


class FanSensor:
    """
    Calculates Fan RPM from pulses on GPIO

    :param gpio_pin: the GPIO pin to read from
    :param samples: the amount of samples to average over
    :param timeout: the maximum time to wait for the amount of samples to come in
    """
    TACH = 24       # Fan's tachometer output pin
    PULSE = 2       # Noctua fans puts out two pluses per revolution
    WAIT_TIME = 1   # [s] Time to wait between each refresh

    def __init__(self, gpio_pin: int, samples=10, timeout=1):
        self.gpio_pin = gpio_pin
        self.samples = samples
        self.timeout = timeout

        self.timer = time.time()
        self.rpms = list()

        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(self.gpio_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)  # Pull up to 3.3V
        GPIO.add_event_detect(self.gpio_pin, GPIO.FALLING, self._handle_event, 5)

    def read(self) -> int:
        """
        samples the GPIO for the given amount of seconds and returns the RPM
        :return: int
        """
        # reset the timer and list of known rpms
        self.rpms = list()
        self.timer = time.time()

        start = time.time()
        while len(self.rpms) < self.samples and time.time() - start < self.timeout:
            time.sleep(0.1)

        return sum(self.rpms) / len(self.rpms)

    def _handle_event(self, _):
        time_delta = time.time() - self.timer
        frequency = 1 / time_delta
        self.rpms.append((frequency / self.PULSE) * 60)
        self.timer = time.time()
