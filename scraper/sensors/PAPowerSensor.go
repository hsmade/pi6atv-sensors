package sensors

import (
	"fmt"
	"time"

	"github.com/sirupsen/logrus"
	"golang.org/x/exp/io/i2c"
)

type PaPowerSensor struct {
	Config  SensorConfig
	Name    string  `json:"name"`
	Type    string  `json:"type"`
	Value   float64 `json:"value"`
	Minimum float64 `json:"min"`
	Maximum float64 `json:"max"`
	device  *i2c.Device
	logger  *logrus.Entry
}

func NewPaPowerSensor(sensorConfig SensorConfig) *PaPowerSensor {
	S := PaPowerSensor{
		Config:  sensorConfig,
		Name:    sensorConfig.Name,
		Type:    "pa_power",
		Minimum: sensorConfig.Minimum,
		Maximum: sensorConfig.Maximum,
		logger:  logrus.WithFields(logrus.Fields{"sensorName": sensorConfig.Name, "sensorType": sensorConfig.Type}),
	}

	d, err := i2c.Open(&i2c.Devfs{Dev: "/dev/i2c-1"}, sensorConfig.I2cAddress)
	if err != nil {
		S.logger.WithError(err).Fatal("failed to open i2c device")
	}
	S.device = d

	return &S
}

func (S *PaPowerSensor) Sense() {
	ticker := time.NewTicker(1 * time.Second)
	for {
		select {
		case _ = <-ticker.C:
			buffer := make([]byte, 1)
			err := S.device.Read(buffer)
			if err != nil {
				S.logger.WithError(err).Error("Failed to read from sensor")
			}

			S.Value = S.mapValue(int(buffer[0]))
			S.logger.Debugf("%s: raw: %d, value: %f\n", S.Config.Name, int(buffer[0]), S.Value)
		}
	}
}

func (S *PaPowerSensor) mapValue(data int) float64 {
	mapping := map[float64]float64{
		//0.09: 0.1,  // 0.09V
		//0.1:  0.2,  // 0.1
		//0.15: 0.3,  // 0.15
		//0.2:  0.4,  // 0.2
		//0.3:  0.5,  // 0.3
		//0.5:  1,    // 0.5
		//0.6:  1.5,  // 0.6
		//0.7:  2,    // 0.7
		1:   -1,   // no value
		50:  2.5,  // 0.8
		55:  3,    // 0.9
		63:  3.5,  // 1.0
		67:  4,    // 1.1
		74:  4.5,  // 1.2
		80:  5,    // 1.3
		84:  5.5,  // 1.4
		92:  6,    // 1.55
		98:  6.5,  // 1.6
		102: 7,    // 1.65
		104: 7.5,  // 1.7
		110: 8,    // 1.8
		117: 8.5,  // 1.9
		123: 9,    // 2
		129: 9.5,  // 2.11
		134: 10,   // 2.2
		140: 10.5, // 2.3
		148: 11,   // 2.4
		153: 11.5, // 2.5
		149: 12,   // 2.6
		165: 12.5, // 2.7
		172: 13,   // 2.8
		178: 13.5, // 2.9
	}

	result := float64(0)
	for volt, power := range mapping {
		if float64(data) >= volt {
			result = power
		} else {
			break
		}
	}

	return result
}

func (S *PaPowerSensor) GetPrometheusMetrics() []byte {
	return []byte(fmt.Sprintf("%s{name=\"%s\"} %f\n", S.Type, S.Config.Name, S.Value))
}
