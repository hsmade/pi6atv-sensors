package sensors

import (
	"fmt"
	"time"

	"github.com/sirupsen/logrus"

	"github.com/hsmade/pi6atv-sensors/sampler/ina260"
)

type INA260Sensor struct {
	Config  SensorConfig
	Power   float64
	Current float64
	Voltage float64
	dev    *ina260.Ina260
	logger  *logrus.Entry
}

func NewINA260Sensor(sensorConfig SensorConfig) *INA260Sensor {
	S := INA260Sensor{
		Config: sensorConfig,
		dev: ina260.NewIna260(sensorConfig.I2cAddress),
		logger: logrus.WithFields(logrus.Fields{"sensorName": sensorConfig.Name, "sensorType": sensorConfig.Type}),
	}

	err := S.dev.Begin()
	if err != nil {
		S.logger.WithError(err).Fatal("Failed to initialize sensor")
	}
	return &S
}

func (S *INA260Sensor) read() (float64, float64, float64, error) {

	return 0, 0, 0, nil
}

func (S *INA260Sensor) Sense() {
	ticker := time.NewTicker(1 * time.Second)
	for {
		select {
		case _ = <-ticker.C:
			power, err := S.dev.ReadPower()
			if err != nil {
				S.logger.WithError(err).Error("Failed to get power from sensor")
			} else {
				S.Power = power
			}

			current, err := S.dev.ReadCurrent()
			if err != nil {
				S.logger.WithError(err).Error("Failed to get current from sensor")
			} else {
				S.Current = current
			}

			voltage, err := S.dev.ReadVoltage()
			if err != nil {
				S.logger.WithError(err).Error("Failed to get voltage from sensor")
			} else {
				S.Voltage = voltage
			}

			S.logger.Debugf("%s: %f, %f, %f\n", S.Config.Name, S.Power, S.Voltage, S.Current)
		}
	}
}

func (S *INA260Sensor) GetPrometheusMetrics() []byte {
	return []byte(fmt.Sprintf("%s{name=\"%s\"} %f\n%s{name=\"%s\"} %f\n%s{name=\"%s\"} %f\n",
		"power", S.Config.Name, S.Power,
		"current", S.Config.Name, S.Current,
		"voltage", S.Config.Name, S.Voltage,
	))
}
