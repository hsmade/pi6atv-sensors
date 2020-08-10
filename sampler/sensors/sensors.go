package sensors

type Sensor interface {
	Sense()
	GetPrometheusMetrics() []byte
}

// temporary to make it compile
type FakeSensor struct {}
func (F FakeSensor) Sense() {}
func (F FakeSensor) GetPrometheusMetrics() []byte { return nil}
func NewFakeSensor(config SensorConfig) *FakeSensor { return &FakeSensor{} }