package sensors

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"log"
	"regexp"
	"strconv"
	"time"

	"github.com/pkg/errors"
)

type DS18B20 struct {
	Config SensorConfig
	Value  float64
}

func NewDS18B20(sensorConfig SensorConfig) *DS18B20 {
	return &DS18B20{Config: sensorConfig}
}

func (F *DS18B20) read() (float64, error) {
	data, err := ioutil.ReadFile(fmt.Sprintf("/sys/bus/w1/devices/%s/w1_slave", F.Config.W1Address))
	if err != nil {
		return 0, errors.Wrap(err, fmt.Sprintf("Failed to read from %s", F.Config.W1Address))
	}

	if !bytes.Contains(data, []byte("YES")) || bytes.HasSuffix(data, []byte("t=0\n")) {
		return 0, errors.New(fmt.Sprintf("Failed to read temperature: %s", string(data)))
	}
	re := regexp.MustCompile(`t=([0-9]+)\n$`)
	results := re.FindAllSubmatch(data,-1)
	if len(results) < 1 && len(results[0]) < 2 { // FIXME index out of range
		log.Fatalf("regexp failed %s\n-->%v", string(data), results)
	}
	value, err := strconv.ParseFloat(string(results[0][1]), 64)
	if err != nil {
		return 0, errors.Wrap(err, fmt.Sprintf("failed to parse float from %s", string(data)))
	}
	return value / 1000, nil
}
func (F *DS18B20) Sense() {
	ticker := time.NewTicker(1 * time.Second)
	for {
		select {
		case _ = <-ticker.C:
			value, err := F.read()
			if err != nil {
				log.Println(err)
			}
			F.Value = value
			log.Printf("%s: %f\n", F.Config.Name, F.Value)
		}
	}
}

func (F *DS18B20) GetPrometheusMetrics() []byte { return nil }
