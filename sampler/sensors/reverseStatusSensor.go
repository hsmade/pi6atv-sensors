package sensors

import (
	"fmt"
	"time"

	"github.com/sirupsen/logrus"
	"periph.io/x/periph/conn/gpio"
	"periph.io/x/periph/conn/gpio/gpioreg"
)

type InverseStatusSensor struct {
	Config SensorConfig
	Name   string `json:"name"`
	Type   string `json:"type"`
	Value  bool   `json:"value"`
	port   gpio.PinIO
	logger *logrus.Entry
}

func NewInverseStatusSensor(sensorConfig SensorConfig) *InverseStatusSensor {
	S := InverseStatusSensor{
		port:   gpioreg.ByName(fmt.Sprintf("GPIO%d", sensorConfig.Gpio)),
		Name:   sensorConfig.Name,
		Type:   "reverse_status",
		Config: sensorConfig,
		logger: logrus.WithFields(logrus.Fields{"sensorName": sensorConfig.Name, "sensorType": sensorConfig.Type}),
	}

	if S.port == nil {
		S.logger.Fatalf("Failed to open GPIO %d", sensorConfig.Gpio)
	}

	if err := S.port.In(gpio.PullDown, gpio.NoEdge); err != nil {
		S.logger.WithError(err).Fatalf("Failed to setup GPIO pin %d", sensorConfig.Gpio)
	}

	return &S
}

func (S *InverseStatusSensor) Sense() {
	ticker := time.NewTicker(1 * time.Second)
	for {
		select {
		case _ = <-ticker.C:
			S.Value = S.port.Read() == gpio.Low
			S.logger.Debugf("%s: %v\n", S.Config.Name, S.Value)
		}
	}
}

//'{type}{{name="{name}", class="{class_name}"}} {value}\n
func (S *InverseStatusSensor) GetPrometheusMetrics() []byte {
	value := 0
	if S.Value {
		value = 1
	}
	return []byte(fmt.Sprintf("%s{name=\"%s\"} %d\n", S.Type, S.Config.Name, value))
}
