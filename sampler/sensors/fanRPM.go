package sensors

import (
	"fmt"
	"log"
	"time"

	"periph.io/x/periph/conn/gpio"
	"periph.io/x/periph/conn/gpio/gpioreg"
)

type FanRPM struct {
	Config SensorConfig
	port   gpio.PinIO
	Value  int
}

func NewFanRPM(config SensorConfig) *FanRPM {
	f := FanRPM{
		port:   gpioreg.ByName(fmt.Sprintf("GPIO%d", config.Gpio)),
		Config: config,
	}

	if f.port == nil {
		log.Fatalf("Failed to start new Fan RPM sensor on port %d", config.Gpio)
	}
	return &f
}

func (F *FanRPM) Sense() {
	if err := F.port.In(gpio.PullUp, gpio.FallingEdge); err != nil {
		log.Fatal(err)
	}

	fanTicks := 0
	go func() {
		for F.port.WaitForEdge(-1) {
			fanTicks++
		}
	}()

	ticker := time.NewTicker(1 * time.Second)
	for {
		select {
		case _ = <-ticker.C:
			F.Value = fanTicks * 60 / 2
			fanTicks = 0
			log.Printf("%s: %dRPM\n", F.Config.Name, F.Value)
		}
	}
}

func (F *FanRPM) GetPrometheusMetrics() []byte { return nil }