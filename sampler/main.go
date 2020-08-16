package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"time"

	"periph.io/x/periph/host"

	"github.com/hsmade/pi6atv-sensors/sampler/config"
	"github.com/hsmade/pi6atv-sensors/sampler/sensors"

	"github.com/sirupsen/logrus"
)

func init() {
	_, err := host.Init()
	if err != nil {
		log.Fatal(err)
	}
}

func main() {
	logrus.SetReportCaller(true)

	conf, err := config.ParseConfig("config.yaml")
	if err != nil {
		log.Fatal(err)
	}

	for _, sensor := range conf.Sensors {
		go func(sensor sensors.Sensor){
			sensor.Sense()
			logrus.WithField("sensor", sensor).Error("Sensor died, restarting")
		}(sensor)
	}

	ticker := time.NewTicker(1 * time.Second)
	for {
		select {
		case _ = <-ticker.C:
			resultJson, _ := json.Marshal(conf)
			ioutil.WriteFile("sensors.json.new", resultJson, 644)

			var promData []byte
			for _, sensor := range conf.Sensors {
				promData = append(promData, sensor.GetPrometheusMetrics()...)
			}
			ioutil.WriteFile("sensors.prometheus.new", promData, 644)
		}
	}
}
