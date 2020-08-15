package sensors

import (
	"fmt"
	"time"

	"github.com/sirupsen/logrus"
	"github.com/morus12/dht22"
)

type DHT22Sensor struct {
	Config      SensorConfig
	Temperature float32
	Humidity    float32
	device *dht22.DHT22
	logger      *logrus.Entry
}

func NewDHT22Sensor(sensorConfig SensorConfig) *DHT22Sensor {
	return &DHT22Sensor{
		Config: sensorConfig,
		device: dht22.New(fmt.Sprintf("GPIO_%d", sensorConfig.Gpio)),
		logger: logrus.WithFields(logrus.Fields{"sensorName": sensorConfig.Name, "sensorType": sensorConfig.Type}),
	}
}

func (S *DHT22Sensor) Sense() {
	ticker := time.NewTicker(1 * time.Second)
	for {
		select {
		case _ = <-ticker.C:
			temperature, err := S.device.Temperature()
			if err != nil {
				S.logger.WithError(err).Error("Failed to read from DHT22Sensor")
			}
			humidity, err := S.device.Humidity()
			if err != nil {
				S.logger.WithError(err).Error("Failed to read from DHT22Sensor")
			}
			S.Temperature = temperature
			S.Humidity = humidity
			S.logger.Debugf("%s: %fC / %f%%\n", S.Config.Name, S.Temperature, S.Humidity)
		}
	}
}

func (S *DHT22Sensor) GetPrometheusMetrics() []byte {
	return []byte(fmt.Sprintf("%s{name=\"%s\"} %f\n%s{name=\"%s\"} %f\n",
		"temperature", S.Config.Name, S.Temperature,
		"humidity", S.Config.Name, S.Humidity,
	))
}
