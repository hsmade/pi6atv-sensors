package sensors

// Describes all possible parameters for a sensor, for deserializing the yaml
type SensorConfig struct {
	Name           string
	Gpio           int     `yaml:"gpio,omitempty"`
	W1Address      string  `yaml:"w1_address,omitempty"`
	I2cAddress     int     `yaml:"i2c_address,omitempty"`
	Path           string  `yaml:"path,omitempty"`
	ControlGpio    int     `yaml:"control_gpio,omitempty"`
	Type           string  `yaml:"type"`
	Minimum        int     `yaml:"minimum,omitempty"`
	CurrentMinimum float64 `yaml:"current_minimum,omitempty"`
	VoltageMinimum float64 `yaml:"voltage_minimum,omitempty"`
	Maximum        int     `yaml:"maximum,omitempty"`
	CurrentMaximum float64 `yaml:"current_maximum,omitempty"`
	VoltageMaximum float64 `yaml:"voltage_maximum,omitempty"`
	Sort           int     `yaml:"sort,omitempty"`
	SwitchPoint    float64 `yaml:"switch_point,omitempty"`
}
