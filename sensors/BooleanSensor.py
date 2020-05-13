class BooleanSensor:
    def __init__(self, gpio: int):
        self.gpio = gpio
        GPIO.setup(gpio, GPIO.IN)

    def read(self) -> bool:
        """
        reads from the sensor and returns the state
        :return: bool
        """
        return GPIO.input(self.gpio) != 0
