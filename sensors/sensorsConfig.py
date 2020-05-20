from .BooleanSensor import BooleanSensor
from .FanSensor import FanSensor
from .PowerSensor import INA260Sensor
from .TemperatureSensor import DS18B20TemperatureSensor, DHT22TemperatureSensor
from .RandomSensor import RandomSensor
from .FlowSensor import FLowSensor

# all gpio_pin numbers are the GPIO numbers, not the board pin numbers
sensor_config = [
    BooleanSensor("Main power supply status", 6),
    BooleanSensor("PA power supply status", 13),
    BooleanSensor("Fluid pump status", 19),
    BooleanSensor("Fan1 status", 23),
    BooleanSensor("Fan2 status", 24),
    BooleanSensor("Fan3 status", 25),
    FanSensor("Fan1 RPM", 17, minimum=0, maximum=2500),
    FanSensor("Fan2 RPM", 27, minimum=0, maximum=2500),
    FanSensor("Fan3 RPM", 22, minimum=0, maximum=2500),
    DS18B20TemperatureSensor("PA temperature", "28-0173ca070002"),
    DS18B20TemperatureSensor("Mounting plate temperature", "28-0417013af9ff"),
    DS18B20TemperatureSensor("Room temperature", "28-0417c475edff"),
    DS18B20TemperatureSensor("Outside temperature", "28-0417c4897aff"),
    DHT22TemperatureSensor("Room", 16),
    INA260Sensor("Main power supply", 0x40),
    INA260Sensor("PA power supply", 0x41),
    INA260Sensor("Fluid pump supply", 0x45),
    FLowSensor("Fluid pump", 7),
    RandomSensor("test sensor", 0, 100),
]
