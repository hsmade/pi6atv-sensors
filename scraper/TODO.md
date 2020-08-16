# Sensors
* ~~CpuTempSensor~~
 * ~~sensor~~
 * ~~control fan~~
* ~~DS18B20Sensor~~
  * ~~refactor, cleanup~~
* ~~fanRPMSensor~~
* ~~FlowSensor~~
* ~~INA260Sensor~~
  * ~~INA260 library~~
  * ~~everything~~
* ~~PAPowerSensor~~
  * ~~everything~~
* ~~reverseStatusSensor~~
* ~~statusSensor~~
* ~~DHT sensor~~
  * ~~everything~~
  * ~~rewrite to use different module, this one is broken~~

# Overal
* ~~prom metric lines~~
* ~~restart sensor threads when they fail~~
* ~~check json format against current~~
* ~~check prom format against current~~
* ~~write new json to file, atomically~~
* ~~write prom data to file, atomically~~
* ~~add sort~~
* ~~ina: support negatives~~
* ~~max for pa?~~
* ~~test dht~~
* ~~test cpu fan~~
* ~~adjust travis to build go and package it~~
* ~~adjust start script to use go binary~~
* remove python code (scraper + sensors)
* ~~fix spec for voltage (ignore if no min / max)~~