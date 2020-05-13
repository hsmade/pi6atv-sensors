import RPi.GPIO as GPIO


class BooleanSensor:
    """
    Boolean sensor, returns the state of a GPIO pin

    :param gpio_pin: The pin to read from
    """
    def __init__(self, gpio_pin: int):
        self.gpio_pin = gpio_pin
        GPIO.setup(gpio_pin, GPIO.IN)

    def read(self) -> bool:
        """
        reads from the sensor and returns the state
        :return: bool
        """
        return GPIO.input(self.gpio_pin) != 0
