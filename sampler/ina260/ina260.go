package ina260

import "periph.io/x/periph/conn/i2c"

type Ina260 struct {
}

func NewIna260(dev *i2c.Dev) *Ina260 {
	return nil
}

func (I *Ina260) Begin() error {

}
