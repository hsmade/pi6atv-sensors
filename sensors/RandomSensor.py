from .BaseSensor import BaseSensor
from random import randint


class RandomSensor(BaseSensor):
    """
    Returns random values, for testing
    """
    type = "temperature"

    def __init__(self, name, minimum=0, maximum=65535):
        super().__init__(name)
        self.minimum = minimum
        self.maximum = maximum

    def read(self):
        return randint(self.minimum, self.maximum)