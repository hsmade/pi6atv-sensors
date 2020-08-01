from .BaseSensor import BaseSensor
import RPi.GPIO as GPIO
import logging

LOG = logging.getLogger(__name__)


class CpuTempSensor(BaseSensor):
    """
    Read CPU Temp from a file
    Switches on fan, when temp > max
    """
    type = "temp_fan"

    def __init__(self, name: str, path: str, fan: int,  maximum: int):
        super().__init__(name)
        self.name = name
        self.path = path
        self.fan_gpio = fan
        self.fan_state = None
        self.maximum = maximum

    def set_fan(self, enable):
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.fan_gpio, GPIO.OUT)
        GPIO.output(self.fan_gpio, enable)
        self.fan_state = enable

    def read(self):
        result = None
        try:
            with open(self.path) as cpu:
                result = int(cpu.read()) / 1000
                if result > self.maximum:
                    LOG.info("enabling fan. Temp=%s", result)
                    self.set_fan(True)
                else:
                    LOG.info("disabling fan. Temp=%s", result)
                    self.set_fan(False)
        except Exception as e:
            LOG.error("failed to read cpu temp from %s: %s", self.path, e)
        return {"temp": result, "fan": self.fan_state}

    def to_dict(self):
        value = self.read()
        return {
            "name": self.name,
            "type": self.type,
            "value": value,
            "maximum": self.maximum,
            "prometheus_data": self.to_openmetrics(value),
        }

    def to_openmetrics(self, value):
        if type(value["temp"]).__name__ not in ["float", "int"]:
            return
        if self.fan_state:
            fan = 1
        else:
            fan = 0
        return \
            '{type}{{name="{name}_temp", class="{class_name}"}} {value_temp}\n{type}{{name="{name}_fan", class="{class_name}"}} {value_fan}\n'.format(
                type=self.type, class_name=type(self).__name__.lower(), name=self.name, value_temp=value["temp"], value_fan=fan)
