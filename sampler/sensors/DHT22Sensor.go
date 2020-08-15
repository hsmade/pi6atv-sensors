package sensors

import (
	"fmt"
	"time"

	"github.com/sirupsen/logrus"
)

type DHT22Sensor struct {
	Config      SensorConfig
	Temperature float32
	Humidity    float32
	logger      *logrus.Entry
}

func NewDHT22Sensor(sensorConfig SensorConfig) *DHT22Sensor {
	return &DHT22Sensor{
		Config: sensorConfig,
		logger: logrus.WithFields(logrus.Fields{"sensorName": sensorConfig.Name, "sensorType": sensorConfig.Type}),
	}
}

func (S *DHT22Sensor) Sense() {
	ticker := time.NewTicker(1 * time.Second)
	for {
		select {
		case _ = <-ticker.C:
			//temperature, humidity, retried, err :=
			//dht.ReadDHTxxWithRetry(dht.DHT22Sensor, S.Config.Gpio, false, 10)
			//if err != nil {
			//	S.logger.WithError(err).Errorf("Failed to read from DHT22Sensor after %d times", retried)
			//}
			//S.Temperature = temperature
			//S.Humidity = humidity
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
