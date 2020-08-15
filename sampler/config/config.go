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
			sensor = sensors.NewFanRPM(sensorConfig)
		case "status":
			sensor = sensors.NewStatus(sensorConfig)
		case "DS18B20":
			sensor = sensors.NewDS18B20(sensorConfig)
		case "DHT22":
			sensor = sensors.NewDHT22(sensorConfig)
		case "INA260":
			sensor = sensors.NewINA260(sensorConfig)
		case "Flow":
			sensor = sensors.NewFlow(sensorConfig)
		case "PA":
			sensor = sensors.NewFakeSensor(sensorConfig)
		case "cpuFan":
			sensor = sensors.NewCpuTemp(sensorConfig)
		case "reverse-status":
			sensor = sensors.NewReverseStatus(sensorConfig)
		default:
			return nil, errors.New(fmt.Sprintf("Can't find a mapping for sensor type: %s", sensorConfig.Type))
		}

		conf.Sensors = append(conf.Sensors, sensor)
	}
	return &conf, nil
}
