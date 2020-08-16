package sensors

import (
	"fmt"
	"time"

	"github.com/morus12/dht22"
	"github.com/sirupsen/logrus"
)

type DHT22Sensor struct {
	Config SensorConfig
	Name   string `json:"name"`
	Type   string `json:"type"`
	Value  struct {
		Temperature float32 `json:"temperature"`
		Humidity    float32 `json:"humidity"`
	} `json:"value"`
	device *dht22.DHT22
	logger *logrus.Entry
}

func NewDHT22Sensor(sensorConfig SensorConfig) *DHT22Sensor {
	return &DHT22Sensor{
		Config: sensorConfig,
		Name:   sensorConfig.Name,
		Type:   "dht22",
		device: dht22.New(fmt.Sprintf("GPIO_%d", sensorConfig.Gpio)),
		logger: logrus.WithFields(logrus.Fields{"sensorName": sensorConfig.Name, "sensorType": sensorConfig.Type}),
	}
}

func (S *DHT22Sensor) Sense() {
	ticker := time.NewTicker(5 * time.Second)
	for {
		select {
		case _ = <-ticker.C:
			temperature, err := S.device.Temperature()
			if err != nil {
				S.logger.WithError(err).Error("Failed to read from DHT22Sensor")
			}
			if temperature != 0 {
				S.Value.Temperature = temperature
			}

			humidity, err := S.device.Humidity()
			if err != nil {
				S.logger.WithError(err).Error("Failed to read from DHT22Sensor")
			}
			if humidity != 0 {
				S.Value.Humidity = humidity
			}

			S.logger.Debugf("%s: %fC / %f%%\n", S.Config.Name, S.Value.Temperature, S.Value.Humidity)
		}
	}
}

func (S *DHT22Sensor) GetPrometheusMetrics() []byte {
	return []byte(fmt.Sprintf("%s{name=\"%s\"} %f\n%s{name=\"%s\"} %f\n",
		"temperature", S.Config.Name, S.Value.Temperature,
		"humidity", S.Config.Name, S.Value.Humidity,
	))
}
