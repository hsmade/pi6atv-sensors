package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
	"time"

	"periph.io/x/periph/host"

	"github.com/hsmade/pi6atv-sensors/scraper/config"
	"github.com/hsmade/pi6atv-sensors/scraper/sensors"

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
	logrus.SetLevel(logrus.DebugLevel)

	conf, err := config.ParseConfig("config.yaml")
	if err != nil {
		log.Fatal(err)
	}

	for _, sensor := range conf.Sensors {
		go func(sensor sensors.Sensor) {
			sensor.Sense()
			logrus.WithField("sensor", sensor).Error("Sensor died, restarting")
		}(sensor)
	}

	ticker := time.NewTicker(1 * time.Second)
	for {
		select {
		case _ = <-ticker.C:
			resultJson, _ := json.Marshal(conf.Sensors)
			err := ioutil.WriteFile("/dev/shm/sensors.json.new", resultJson, 644)
			if err != nil {
				logrus.WithError(err).Error("Failed to write sensors.json.new")
			}
			err = os.Rename("/dev/shm/sensors.json.new", "/dev/shm/sensors.json")
			if err != nil {
				logrus.WithError(err).Error("Failed to rename sensors.json.new")
			}

			var promData []byte
			for _, sensor := range conf.Sensors {
				promData = append(promData, sensor.GetPrometheusMetrics()...)
			}
			err = ioutil.WriteFile("/dev/shm/sensors.prometheus.new", promData, 644)
			if err != nil {
				logrus.WithError(err).Error("Failed to write sensors.prometheus.new")
			}
			err = os.Rename("/dev/shm/sensors.prometheus.new", "/dev/shm/sensors.prometheus")
			if err != nil {
				logrus.WithError(err).Error("Failed to rename sensors.prometheus.new")
			}
		}
	}
}
