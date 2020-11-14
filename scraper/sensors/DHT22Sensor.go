package sensors

import (
	"fmt"
	"io/ioutil"
	"strconv"
	"strings"
	"time"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

type DHT22Sensor struct {
	Config SensorConfig
	Name   string `json:"name"`
	Type   string `json:"type"`
	Value  struct {
		//Temperature float32 `json:"temperature"`
		Humidity float32 `json:"humidity"`
	} `json:"value"`
	logger *logrus.Entry
}

func NewDHT22Sensor(sensorConfig SensorConfig) *DHT22Sensor {
	return &DHT22Sensor{
		Config: sensorConfig,
		Name:   sensorConfig.Name,
		Type:   "dht22",
		logger: logrus.WithFields(logrus.Fields{"sensorName": sensorConfig.Name, "sensorType": sensorConfig.Type}),
	}
}

func (S *DHT22Sensor) Sense() {
	ticker := time.NewTicker(15 * time.Second)
	for {
		select {
		case _ = <-ticker.C:
			//temperature, err := getValue(S.Config.Path + "/in_temp_input")
			//if err != nil {
			//	S.logger.WithError(err).Error("Failed to read temperature from DHT22Sensor")
			//}
			//if temperature != 0 {
			//	S.Value.Temperature = temperature
			//}
			//
			humidity, err := getValue(S.Config.Path + "/in_humidityrelative_input")
			if err != nil {
				S.logger.WithError(err).Error("Failed to read humidity from DHT22Sensor")
			}
			if humidity != 0 {
				S.Value.Humidity = humidity
			}

			S.logger.Debugf("%s: %f%%\n", S.Config.Name, S.Value.Humidity)
		}
	}
}

func getValue(path string) (float32, error) {
	data, err := ioutil.ReadFile(path)
	if err != nil {
		return 0, errors.Wrap(err, "Failed to read value from DHT22Sensor")
	}
	value, err := strconv.ParseInt(strings.Trim(string(data), "\n"), 10, 64)
	if err != nil {
		return 0, errors.Wrap(err, "Failed to parse value from DHT22Sensor")
	}

	return float32(value) / 1000, nil
}

func (S *DHT22Sensor) GetPrometheusMetrics() []byte {
	return []byte(fmt.Sprintf("%s{name=\"%s\",type=\"dht22\"} %f\n",
		"humidity", S.Config.Name, S.Value.Humidity,
	))
}
