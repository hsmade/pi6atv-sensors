import React, {Component} from 'react';
import Chart from "react-google-charts";

class GaugeSensor extends Component {
    state = {
        value: 1,
    };

    intervalID = null;

    options = {
        width: 120,
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
            [this.props.sensor.name, this.props.sensor.value]
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
                value: 0
                };
            });
        }, 3000);
    }
    render() {
        return (
                <Chart
                    chartType="Gauge"
                    width="100%"
                    height="{this.options.height}px"
                    data={this.getData()}
                    options={this.options}
                />
        );
    }
}
export default GaugeSensor;
