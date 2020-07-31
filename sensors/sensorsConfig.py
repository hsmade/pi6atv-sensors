from .BooleanSensor import BooleanSensor, ReverseBooleanSensor
from .FanSensor import FanSensor
from .PowerSensor import INA260Sensor
from .TemperatureSensor import DS18B20TemperatureSensor, DHT22TemperatureSensor
from .FlowSensor import FLowSensor
from .PAsensor import PASensor

# all gpio_pin numbers are the GPIO numbers, not the board pin numbers
sensor_config = [
    BooleanSensor("Mains", 6),
    BooleanSensor("PA", 13),
    BooleanSensor("Pump", 19),
    BooleanSensor("MX", 20),
    BooleanSensor(name="40 °C", gpio_pin=23),
    BooleanSensor(name="50 °C", gpio_pin=24),
    BooleanSensor(name="60 °C", gpio_pin=25),
    FanSensor(name="40 °C", gpio_pin=17, minimum=1500, maximum=2100),
    FanSensor(name="50 °C", gpio_pin=27, minimum=1500, maximum=2100),
    FanSensor(name="60 °C", gpio_pin=22, minimum=1500, maximum=2100),
    DS18B20TemperatureSensor("PA", "28-01186e81daff"),
    DS18B20TemperatureSensor("MP", "28-0417c475edff"),
    DS18B20TemperatureSensor("RM", "28-0417c4897aff"),
    DS18B20TemperatureSensor("Out", "28-3c01a8161b4e"),
    DS18B20TemperatureSensor("MX", "28-3c01a816499d"),
    DHT22TemperatureSensor("RM", 16),
    INA260Sensor("Mains", 0x40),
    INA260Sensor("PA", 0x41, max_current=8, min_current=5),
    INA260Sensor("MX", 0x44, max_current=0.7, min_current=0.5),
    INA260Sensor("Pump", 0x45, max_current=1.9, min_current=0.25),
    FLowSensor("Pump", 12),
    ReverseBooleanSensor("Fluid detection", 15),
    PASensor("PA", 26, maximum=20, minimum=0),
]
