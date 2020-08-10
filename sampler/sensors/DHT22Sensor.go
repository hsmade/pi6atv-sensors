package sensors

import (
	"fmt"
	"time"

	"github.com/d2r2/go-dht"
	"github.com/sirupsen/logrus"
)

type DHT22 struct {
	Config      SensorConfig
	Temperature float32
	Humidity    float32
	logger      *logrus.Entry
}

func NewDHT22(sensorConfig SensorConfig) *DHT22 {
	return &DHT22{
		Config: sensorConfig,
		logger: logrus.WithFields(logrus.Fields{"sensorName": sensorConfig.Name, "sensorType": sensorConfig.Type}),
	}
}

func (S *DHT22) Sense() {
	ticker := time.NewTicker(1 * time.Second)
	for {
		select {
		case _ = <-ticker.C:
			temperature, humidity, retried, err :=
				dht.ReadDHTxxWithRetry(dht.DHT22, S.Config.Gpio, false, 10)
			if err != nil {
				S.logger.WithError(err).Errorf("Failed to read from DHT22 after %d times", retried)
			}
			S.Temperature = temperature
			S.Humidity = humidity
			S.logger.Debugf("%s: %fC / %f%%\n", S.Config.Name, S.Temperature, S.Humidity)
		}
	}
}

func (S *DHT22) GetPrometheusMetrics() []byte {
	return []byte(fmt.Sprintf("%s{name=\"%s\"} %f\n%s{name=\"%s\"} %f\n",
		"temperature", S.Config.Name, S.Temperature,
		"humidity", S.Config.Name, S.Humidity,
		))
}
