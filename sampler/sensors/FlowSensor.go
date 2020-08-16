package sensors

import (
	"fmt"
	"time"

	"github.com/sirupsen/logrus"
	"periph.io/x/periph/conn/gpio"
	"periph.io/x/periph/conn/gpio/gpioreg"
)

type FlowSensor struct {
	Config SensorConfig
	Name   string  `json:"name"`
	Type   string  `json:"type"`
	Value  float64 `json:"value"`
	port   gpio.PinIO
	logger *logrus.Entry
}

func NewFlowSensor(sensorConfig SensorConfig) *FlowSensor {
	S := FlowSensor{
		Config: sensorConfig,
		Name:   sensorConfig.Name,
		Type:   "flow",
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

func (S *FlowSensor) Sense() {
	fanTicks := 0

	go func() {
		for S.port.WaitForEdge(-1) {
			fanTicks++
		}
	}()

	ticker := time.NewTicker(1 * time.Second)
	for {
		select {
		case _ = <-ticker.C:
			S.Value = float64(fanTicks) * 60 * 2.25 / 1000
			fanTicks = 0
			S.logger.Debugf("%s: %dL/min\n", S.Config.Name, S.Value)
		}
	}
}

func (S *FlowSensor) GetPrometheusMetrics() []byte {
	return []byte(fmt.Sprintf("%s{name=\"%s\"} %f\n", S.Type, S.Config.Name, S.Value))
}
