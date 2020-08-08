package sensors

import (
	"fmt"
	"log"
	"time"

	"periph.io/x/periph/conn/gpio"
	"periph.io/x/periph/conn/gpio/gpioreg"
)

type ReverseStatus struct {
	Config SensorConfig
	port   gpio.PinIO
	Value  bool
}

func NewReverseStatus(config SensorConfig) *ReverseStatus {
	s := ReverseStatus{
		port:   gpioreg.ByName(fmt.Sprintf("GPIO%d", config.Gpio)),
		Config: config,
	}

	if s.port == nil {
		log.Fatalf("Failed to start new ReverseStatus sensor on port %d", config.Gpio)
	}
	return &s
}

func (F *ReverseStatus) Sense() {
	if err := F.port.In(gpio.PullDown, gpio.NoEdge); err != nil {
		log.Fatal(err)
	}

	ticker := time.NewTicker(1 * time.Second)
	for {
		select {
		case _ = <-ticker.C:
			F.Value = F.port.Read() == gpio.Low
			log.Printf("%s: %v\n", F.Config.Name, F.Value)
		}
	}
}

func (F *ReverseStatus) GetPrometheusMetrics() []byte { return nil }