package sensors

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"regexp"
	"strconv"
	"time"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

type DS18B20Sensor struct {
	Config SensorConfig
	Value  float64
	logger *logrus.Entry
}

func NewDS18B20Sensor(sensorConfig SensorConfig) *DS18B20Sensor {
	return &DS18B20Sensor{
		Config: sensorConfig,
		logger: logrus.WithFields(logrus.Fields{"sensorName": sensorConfig.Name, "sensorType": sensorConfig.Type}),
	}
}

func (S *DS18B20Sensor) read() (float64, error) {
	data, err := ioutil.ReadFile(fmt.Sprintf("/sys/bus/w1/devices/%s/w1_slave", S.Config.W1Address))
	if err != nil {
		return 0, errors.Wrap(err, fmt.Sprintf("Failed to read from %s", S.Config.W1Address))
	}

	// validate data
	if !bytes.Contains(data, []byte("YES")) || bytes.HasSuffix(data, []byte("t=0\n")) {
		return 0, errors.New(fmt.Sprintf("Failed to read temperature: %s", string(data)))
	}

	// parse data
	re := regexp.MustCompile(`t=([0-9]+)\n$`)
	results := re.FindAllSubmatch(data, -1)
	if len(results) < 1 || len(results[0]) < 2 {
		S.logger.Fatalf("regexp failed %s\n-->%v", string(data), results)
	}
	value, err := strconv.ParseFloat(string(results[0][1]), 64)
	if err != nil {
		return 0, errors.Wrap(err, fmt.Sprintf("failed to parse float from %s", string(data)))
	}
	return value / 1000, nil
}

func (S *DS18B20Sensor) Sense() {
	ticker := time.NewTicker(1 * time.Second)
	for {
		select {
		case _ = <-ticker.C:
			value, err := S.read()
			if err != nil {
				S.logger.WithError(err).Error("Failed to read from sensor")
			}
			S.Value = value
			S.logger.Debugf("%s: %f\n", S.Config.Name, S.Value)
		}
	}
}

func (S *DS18B20Sensor) GetPrometheusMetrics() []byte {
	return []byte(fmt.Sprintf("%s{name=\"%s\"} %f\n", "temperature", S.Config.Name, S.Value))
}
