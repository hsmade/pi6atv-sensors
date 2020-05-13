class BooleanSensor:
    def __init__(self, gpio_pin: int):
        self.gpio_pin = gpio_pin
        GPIO.setup(gpio_pin, GPIO.IN)

    def read(self) -> bool:
        """
        reads from the sensor and returns the state
        :return: bool
        """
        return GPIO.input(self.gpio_pin) != 0
