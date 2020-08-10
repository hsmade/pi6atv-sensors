package sensors

import (
	"fmt"
	"time"

	"github.com/sirupsen/logrus"
	"periph.io/x/periph/conn/gpio"
	"periph.io/x/periph/conn/gpio/gpioreg"
)

type FanRPM struct {
	Config SensorConfig
	Value  int
	port   gpio.PinIO
	logger *logrus.Entry
}

func NewFanRPM(sensorConfig SensorConfig) *FanRPM {
	S := FanRPM{
		Config: sensorConfig,
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

func (S *FanRPM) Sense() {
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
			S.Value = fanTicks * 60 / 2
			fanTicks = 0
			S.logger.Debugf("%s: %dRPM\n", S.Config.Name, S.Value)
		}
	}
}

func (S *FanRPM) GetPrometheusMetrics() []byte {
	return []byte(fmt.Sprintf("%s{name=\"%s\"} %d\n", "rpm", S.Config.Name, S.Value))
}
