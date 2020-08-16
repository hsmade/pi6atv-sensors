package sensors

import (
	"fmt"
	"io/ioutil"
	"strconv"
	"strings"
	"time"

	"github.com/sirupsen/logrus"
	"periph.io/x/periph/conn/gpio"
	"periph.io/x/periph/conn/gpio/gpioreg"
)

type CpuTempSensor struct {
	Config SensorConfig
	Name   string `json:"name"`
	Type   string `json:"type"`
	Value  struct {
		Temp float64 `json:"temp"`
		Fan  bool    `json:"fan"`
	} `json:"value"`
	controlPort gpio.PinIO
	logger      *logrus.Entry
}

func NewCpuTempSensor(sensorConfig SensorConfig) *CpuTempSensor {
	S := CpuTempSensor{
		Config:      sensorConfig,
		Name:        sensorConfig.Name,
		Type:        "temp_fan",
		controlPort: gpioreg.ByName(fmt.Sprintf("GPIO%d", sensorConfig.ControlGpio)),
		logger:      logrus.WithFields(logrus.Fields{"sensorName": sensorConfig.Name, "sensorType": sensorConfig.Type}),
	}

	if S.controlPort == nil {
		S.logger.Fatalf("Failed to open GPIO %d", sensorConfig.ControlGpio)
	}

	return &S
}

func (S *CpuTempSensor) switchFan(status bool) error {
	err := S.controlPort.Out(gpio.Level(status))
	if err != nil {
		return err
	}
	S.Value.Fan = status
	return nil
}

func (S *CpuTempSensor) readTemperature() (float64, error) {
	data, err := ioutil.ReadFile(S.Config.Path)
	if err != nil {
		return 0, err
	}

	value, err := strconv.ParseFloat(strings.TrimSuffix(string(data), "\n"), 64)
	if err != nil {
		return 0, err
	}

	return value / 1000, nil
}

func (S *CpuTempSensor) Sense() {
	ticker := time.NewTicker(1 * time.Second)
	for {
		select {
		case _ = <-ticker.C:
			value, err := S.readTemperature()
			if err != nil {
				S.logger.WithError(err).Error("Failed to read temperature")
			}
			S.Value.Temp = value
			S.logger.Debugf("%s: %v\n", S.Config.Name, S.Value)

			if S.Value.Temp > S.Config.SwitchPoint {
				S.logger.Debug("Switching on fan")
				err = S.switchFan(true)
			} else {
				S.logger.Debug("Switching off fan")
				err = S.switchFan(false)
			}
			if err != nil {
				S.logger.WithError(err).Error("Failed to switch fan")
			}
		}
	}
}

func (S *CpuTempSensor) GetPrometheusMetrics() []byte {
	fanStatus := 0
	if S.Value.Fan {
		fanStatus = 1
	}
	return []byte(fmt.Sprintf("%s{name=\"%s_temp\"} %f\n%s{name=\"%s_fan\"} %d\n",
		S.Type, S.Config.Name, S.Value.Temp,
		S.Type, S.Config.Name, fanStatus,
	))
}
