package main

import (
    "encoding/json"
    "fmt"
    "log"
    "time"

    "periph.io/x/periph/host"

    "github.com/hsmade/pi6atv-sensors/sampler/config"
)

func init() {
    _, err := host.Init()
    if err != nil {
        log.Fatal(err)
    }
}

func main() {
    conf, err := config.ParseConfig("config.yaml")
    if err != nil {
        log.Fatal(err)
    }

    for _, sensor := range conf.Sensors {
        go sensor.Sense()  // FIXME: watch and keep alive
    }

    ticker := time.NewTicker(1 * time.Second)
    for {
        select {
        case _ = <-ticker.C:
            resultJson, _ := json.Marshal(conf)
            fmt.Println(string(resultJson))
        }
    }
}
