package sensors

import (
	"fmt"
	"log"
	"time"

	"periph.io/x/periph/conn/gpio"
	"periph.io/x/periph/conn/gpio/gpioreg"
)

type Status struct {
	Config SensorConfig
	port   gpio.PinIO
	Value  bool
}

func NewStatus(config SensorConfig) *Status {
	s := Status{
		port:   gpioreg.ByName(fmt.Sprintf("GPIO%d", config.Gpio)),
		Config: config,
	}

	if s.port == nil {
		log.Fatalf("Failed to start new Status sensor on port %d", config.Gpio)
	}
	return &s
}

func (F *Status) Sense() {
	if err := F.port.In(gpio.PullDown, gpio.NoEdge); err != nil {
		log.Fatal(err)
	}

	ticker := time.NewTicker(1 * time.Second)
	for {
		select {
		case _ = <-ticker.C:
			F.Value = F.port.Read() == gpio.High
			log.Printf("%s: %v\n", F.Config.Name, F.Value)
		}
	}
}

func (F *Status) GetPrometheusMetrics() []byte { return nil }