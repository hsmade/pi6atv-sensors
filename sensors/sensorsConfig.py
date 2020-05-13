from .BooleanSensor import BooleanSensor
from .FanSensor import FanSensor
from .PowerSensor import INA260Sensor
from .TemperatureSensor import DHT22TemperatureSensor, DS18B20TemperatureSensor

sensor_config = [
    {
        "object": BooleanSensor(17),
        "name": "Main power supply status",
        "type": "bool",
    },
    {
        "object": BooleanSensor(27),
        "name": "PA power supply status",
        "type": "bool",
    },
    {
        "object": BooleanSensor(22),
        "name": "Fluid pump status",
        "type": "bool",
    },
    {
        "object": FanSensor(13),
        "name": "Fan1 RPM",
        "type": "RPM",
    },
    {
        "object": FanSensor(19),
        "name": "Fan2 RPM",
        "type": "RPM",
    },
    {
        "object": FanSensor(26),
        "name": "Fan3 RPM",
        "type": "RPM",
    },
    {
        "object": DS18B20TemperatureSensor("28-0417013af9ff"),
        "name": "PA temperature",
        "type": "temperature",
    },
    {
        "object": DS18B20TemperatureSensor("28-00348a000019"),
        "name": "Mounting plate temperature",
        "type": "temperature",
    },
    {
        "object": DS18B20TemperatureSensor("28-0417c475edff"),
        "name": "Room temperature (DS18B20)",
        "type": "temperature",
    },
    {
        "object": DHT22TemperatureSensor(16),
        "name": "Room",
        "type": "dht22",
    },
]
