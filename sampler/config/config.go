package config

import (
	"fmt"
	"github.com/pkg/errors"
	"gopkg.in/yaml.v2"
	"io/ioutil"

	"github.com/hsmade/pi6atv-sensors/sampler/sensors"
)

type Config struct {
	Sensors []sensors.Sensor
}

type configFile struct {
	Sensors []sensors.SensorConfig
}

func ParseConfig(filename string) (*Config, error) {
	var configFile configFile
	fileContents, err := ioutil.ReadFile(filename)
	if err != nil {
		return nil, errors.Wrap(err, "reading config file")
	}
	err = yaml.Unmarshal(fileContents, &configFile)
	if err != nil {
		return nil, errors.Wrap(err, "parsing config file")
	}

	var conf Config
	for _, sensorConfig := range configFile.Sensors {
		var sensor sensors.Sensor
		switch sensorConfig.Type {
		case "fanRPM":
			sensor = sensors.NewFanRPMSensor(sensorConfig)
		case "status":
			sensor = sensors.NewStatusSensor(sensorConfig)
		case "DS18B20Sensor":
			sensor = sensors.NewDS18B20Sensor(sensorConfig)
		case "DHT22Sensor":
			sensor = sensors.NewDHT22Sensor(sensorConfig)
		case "INA260Sensor":
			sensor = sensors.NewINA260Sensor(sensorConfig)
		case "Flow":
			sensor = sensors.NewFlowSensor(sensorConfig)
		case "PA":
			sensor = sensors.NewFakeSensor(sensorConfig)
		case "cpuFan":
			sensor = sensors.NewCpuTempSensor(sensorConfig)
		case "reverse-status":
			sensor = sensors.NewInverseStatusSensor(sensorConfig)
		default:
			return nil, errors.New(fmt.Sprintf("Can't find a mapping for sensor type: %s", sensorConfig.Type))
		}

		conf.Sensors = append(conf.Sensors, sensor)
	}
	return &conf, nil
}
