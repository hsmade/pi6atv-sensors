import React, {Component} from 'react';
// import Chart from "react-google-charts";

class PowerSensor extends Component {
    state = {
        // voltage: 0,
        // current: 0,
        // power: 0,
    };

    // intervalID = null;
    //
    // options = {
    //     width: 400,
    //     height: 120,
    //     max: this.props.sensor.max,
    //     redFrom: this.props.sensor.redFrom,
    //     redTo: this.props.sensor.max,
    //     greenFrom: this.props.sensor.min,
    //     greenTo: this.props.sensor.max,
    //     minorTicks: 5
    // };
    //
    // getData = () => {
    //     return [
    //         ["Label", "Value"],
    //         ["voltage", this.props.sensor.value.voltage],
    //         ["current", this.props.sensor.value.current],
    //         ["power", this.props.sensor.value.power],
    //     ];
    // };
    // componentWillUnmount() {
    //     if (this.intervalID === null) return;
    //     clearInterval(this.intervalID);
    // }
    // componentDidMount() {
    //     this.intervalID = setInterval(() => {
    //         this.setState(state => {
    //             return {
    //                 ...state,
    //             voltage: this.props.sensor.value.voltage,
    //             current: this.props.sensor.value.current,
    //             power: this.props.sensor.value.power,
    //             };
    //         });
    //     }, 3000);
    // }
    render() {
        let current_value = this.props.sensor.value.current
        let current_sign = "A"
        if (current_value < 1000) {
            current_sign = "mA"
        } else {
            current_value = current_value / 1000
        }
        let power_value = (this.props.sensor.value.power / 1000).toFixed(3)
        let power_sign = "W"
        if (power_sign > 1) {
            power_value = power_value.toFixed(1)
        }
        if (power_value >= 1000) {
            power_sign = "kW"
            power_value = power_value.toFixed(1)
        }
        return (
            <div>
                <p style={{fontFamily: 'digital-7-italic', color: "blue"}}>
                    <img src={"electricity.png"} height={32} color={"blue"} alt={"electricity"}/>
                    &nbsp;
                    <b>{this.props.sensor.value.voltage.toFixed(1)}</b>
                    &nbsp;
                    V
                    &nbsp;
                    <b>{current_value.toFixed(1)}</b>
                    &nbsp;
                    {current_sign}
                    &nbsp;
                    <b>{power_value}</b>
                    &nbsp;
                    {power_sign}
                </p>
                {/*<h3>{this.props.sensor.name}</h3>*/}
                {/*<Chart*/}
                {/*    chartType="Gauge"*/}
                {/*    width="100%"*/}
                {/*    height="{this.options.height}px"*/}
                {/*    data={this.getData()}*/}
                {/*    options={this.options}*/}
                {/*/>*/}
            </div>
        );
    }
}
export default PowerSensor;
