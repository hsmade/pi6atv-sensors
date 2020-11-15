package sensors

import (
	"fmt"
	"time"

	"github.com/sirupsen/logrus"
	"periph.io/x/periph/conn/gpio"
	"periph.io/x/periph/conn/gpio/gpioreg"
)

type FanRPMSensor struct {
	Config   SensorConfig
	Name     string `json:"name"`
	Type     string `json:"type"`
	Value    int    `json:"value"`
	Sort     int    `json:"sort"`
	port     gpio.PinIO
	fanTicks int64
	logger   *logrus.Entry
}

func NewFanRPMSensor(sensorConfig SensorConfig) *FanRPMSensor {
	S := FanRPMSensor{
		Config: sensorConfig,
		Name:   sensorConfig.Name,
		Type:   "rpm",
		Sort:   sensorConfig.Sort,
		port:   gpioreg.ByName(fmt.Sprintf("GPIO%d", sensorConfig.Gpio)),
		logger: logrus.WithFields(logrus.Fields{"sensorName": sensorConfig.Name, "sensorType": sensorConfig.Type}),
	}

	if S.port == nil {
		S.logger.Fatalf("Failed to open GPIO %d", sensorConfig.Gpio)
	}

	if err := S.port.In(gpio.PullUp, gpio.FallingEdge); err != nil {
		S.logger.WithError(err).Fatalf("Failed to setup GPIO pin %d", sensorConfig.Gpio)
	}

	return &S
}

func (S *FanRPMSensor) Sense() {
	go func() {
		for {
			triggered := S.port.WaitForEdge(1 * time.Second)
			if triggered {
				S.fanTicks++
			}
		}
	}()

	ticker := time.NewTicker(1 * time.Second)
	for {
		select {
		case _ = <-ticker.C:
			S.Value = int(S.fanTicks * 60 / 2)
			S.fanTicks = 0
			S.logger.Debugf("%s: %dRPM\n", S.Config.Name, S.Value)
		}
	}
}

func (S *FanRPMSensor) GetPrometheusMetrics() []byte {
	return []byte(fmt.Sprintf("%s{name=\"%s\"} %d\n", S.Type, S.Config.Name, S.Value))
}
