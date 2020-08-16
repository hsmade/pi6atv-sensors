package sensors

import (
	"fmt"
	"time"

	"github.com/sirupsen/logrus"

	"github.com/hsmade/pi6atv-sensors/sampler/ina260"
)

type INA260Sensor struct {
	Config SensorConfig
	Name   string `json:"name"`
	Type   string `json:"type"`
	Value  Value  `json:"value"`
	Sort   int    `json:"sort"`
	dev    *ina260.Ina260
	logger *logrus.Entry
}

type Value struct {
	Power      float64 `json:"power"`
	Current    float64 `json:"current"`
	Voltage    float64 `json:"voltage"`
	MinCurrent float64 `json:"min_current"`
	MaxCurrent float64 `json:"max_current"`
	MinVoltage float64 `json:"min_voltage"`
	MaxVoltage float64 `json:"max_voltage"`
}

func NewINA260Sensor(sensorConfig SensorConfig) *INA260Sensor {
	S := INA260Sensor{
		Config: sensorConfig,
		Name:   sensorConfig.Name,
		Type:   "power",
		Value:  Value{MinCurrent: sensorConfig.CurrentMinimum, MaxCurrent: sensorConfig.CurrentMaximum, MinVoltage: sensorConfig.VoltageMinimum, MaxVoltage: sensorConfig.VoltageMaximum},
		Sort:   sensorConfig.Sort,
		dev:    ina260.NewIna260(sensorConfig.I2cAddress),
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
				S.Value.Power = power
			}

			current, err := S.dev.ReadCurrent()
			if err != nil {
				S.logger.WithError(err).Error("Failed to get current from sensor")
			} else {
				S.Value.Current = current
			}

			voltage, err := S.dev.ReadVoltage()
			if err != nil {
				S.logger.WithError(err).Error("Failed to get voltage from sensor")
			} else {
				S.Value.Voltage = voltage
			}

			S.logger.Debugf("%s: %fW, %fV, %fmA\n", S.Config.Name, S.Value.Power, S.Value.Voltage, S.Value.Current)
		}
	}
}

func (S *INA260Sensor) GetPrometheusMetrics() []byte {
	return []byte(fmt.Sprintf("%s{name=\"%s\"} %f\n%s{name=\"%s\"} %f\n%s{name=\"%s\"} %f\n",
		"power", S.Config.Name, S.Value.Power,
		"current", S.Config.Name, S.Value.Current,
		"voltage", S.Config.Name, S.Value.Voltage,
	))
}
