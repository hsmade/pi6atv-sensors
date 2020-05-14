import React, {Component} from 'react';
import Chart from "react-google-charts";

class DHTSensor extends Component {
    state = {
        voltage: 0,
        current: 0,
        power: 0,
    };

    intervalID = null;

    options = {
        width: 260,
        height: 120,
        max: this.props.sensor.max,
        redFrom: this.props.sensor.redFrom,
        redTo: this.props.sensor.max,
        greenFrom: this.props.sensor.min,
        greenTo: this.props.sensor.max,
        minorTicks: 5
    };

    getData = () => {
        return [
            ["Label", "Value"],
            ["temperature", this.props.sensor.value.temperature],
            ["humidity", this.props.sensor.value.humidity],
        ];
    };
    componentWillUnmount() {
        if (this.intervalID === null) return;
        clearInterval(this.intervalID);
    }
    componentDidMount() {
        this.intervalID = setInterval(() => {
            this.setState(state => {
                return {
                    ...state,
                    temperature: this.props.sensor.value.temperature,
                    humidity: this.props.sensor.value.humidity,
                };
            });
        }, 3000);
    }
    render() {
        return (
            <div>
                <h3>{this.props.sensor.name}</h3>
                <Chart
                    chartType="Gauge"
                    width="100%"
                    height="{this.options.height}px"
                    data={this.getData()}
                    options={this.options}
                />
            </div>
        );
    }
}
export default DHTSensor;
