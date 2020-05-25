import React, {Component} from 'react';

class DHTSensor extends Component {
    render() {
        return ([
            <tr key={"temp"}>
                <td>
                    <img src={"thermometer.png"} height={this.props.height/25} alt={"thermometer"}/>
                </td>
                <td>
                    <span className={"label"}>
                        {this.props.sensor.name}
                    </span>
                </td>
                <td>
                    <span className={"digit"}>
                        <b>{this.props.sensor.value.temperature.toFixed(1)}</b>
                    </span>
                </td>
                <td>
                    <span className={"label"}>
                        °C
                    </span>
                </td>
            </tr>,
            <tr key={"hum"}>
                <td>
                    <img src={"humidity.png"} height={this.props.height/25} alt={"humidity"}/>
                </td>
                <td>
                    <span className={"label"}>
                        {this.props.sensor.name}
                    </span>
                </td>
                <td>
                    <span className={"digit"}>
                        <b>{this.props.sensor.value.humidity.toFixed(1)}</b>
                    </span>
                </td>
                <td>
                    <span className={"label"}>
                        %
                    </span>
                </td>
            </tr>
        ]);
    }
}
export default DHTSensor;
