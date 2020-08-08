package sensors

type SensorConfig struct {
	Name           string
	Gpio           int    `yaml:"gpio,omitempty"`
	W1Address      string `yaml:"w1_address,omitempty"`
	I2cAddress     string `yaml:"i2c_address,omitempty"`
	Path           string `yaml:"path,omitempty"`
	ControlGpio    int    `yaml:"control_gpio,omitempty"`
	Type           string `yaml:"type"`
	Minimum        int    `yaml:"minimum,omitempty"`
	CurrentMinimum int    `yaml:"current_minimum,omitempty"`
	Maximum        int    `yaml:"maximum,omitempty"`
	CurrentMaximum int    `yaml:"current_maximum,omitempty"`
	Sort           int    `yaml:"sort,omitempty"`
}
