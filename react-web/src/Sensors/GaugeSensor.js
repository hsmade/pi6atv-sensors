import React, {Component} from 'react';
// import Chart from "react-google-charts";
// import {blue} from "@material-ui/core/colors";

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
        let icon = "";
        let sign = "";
        switch (this.props.sensor.type) {
            case "temperature": icon = "thermometer.png"; sign = "°C"; break
            case "rpm": icon = "fan.png"; sign = "rpm"; break
            default: break
        }
        let value = this.props.sensor.value
        if (value > 0) {
            value = value.toFixed(1)
        }
        return (
            <div>
                <p style={{fontFamily: 'digital-7-italic', color: "blue"}}>
                    <img src={icon} height={32} color={"blue"} alt={icon}/>
                    &nbsp;
                    <b>{value}</b>
                    &nbsp;
                    {sign}
                    &nbsp;
                    {this.props.sensor.name}
                </p>
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
export default GaugeSensor;
