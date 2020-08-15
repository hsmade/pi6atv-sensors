package sensors

import (
	"fmt"
	"log"
	"time"

	"github.com/sirupsen/logrus"
	"periph.io/x/periph/conn/i2c"
	"periph.io/x/periph/conn/i2c/i2creg"
)

type INA260 struct {
	Config  SensorConfig
	Power   float64
	Current float64
	Voltage float64
	port    *i2c.Dev
	logger  *logrus.Entry
}

func NewINA260(sensorConfig SensorConfig) *INA260 {
	bus, err := i2creg.Open("")
	if err != nil {
		log.Fatal(err)
	}

	S := INA260{
		Config: sensorConfig,
		port:   &i2c.Dev{Addr: sensorConfig.I2cAddress, Bus: bus},
		logger: logrus.WithFields(logrus.Fields{"sensorName": sensorConfig.Name, "sensorType": sensorConfig.Type}),
	}

	return &S
}

func (S *INA260) read() (float64, float64, float64, error) {
	return 0, 0, 0, nil
}

func (S *INA260) Sense() {
	ticker := time.NewTicker(1 * time.Second)
	for {
		select {
		case _ = <-ticker.C:
			power, current, voltage, err := S.read()
			if err != nil {
				S.logger.WithError(err).Error("Failed to get data from sensor")
			}
			S.Power = power
			S.Current = current
			S.Voltage = voltage
			//S.logger.Debugf("%s: %v\n", S.Config.Name, S.Value)
		}
	}
}

func (S *INA260) GetPrometheusMetrics() []byte {
	return []byte(fmt.Sprintf("%s{name=\"%s\"} %d\n%s{name=\"%s\"} %d\n%s{name=\"%s\"} %d\n",
		"power", S.Config.Name, S.Power,
		"current", S.Config.Name, S.Current,
		"voltage", S.Config.Name, S.Voltage,
	))
}
