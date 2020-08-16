package sensors

type Sensor interface {
	Sense()
	GetPrometheusMetrics() []byte
}
