import React, {Component} from 'react';

class DHTSensor extends Component {
    render() {
        return ([
            <tr key={"temp"}>
                <td>
                    <img src={"thermometer.png"} height={32} alt={"thermometer"}/>
                </td>
                <td>
                    <span class={"label"}>
                        {this.props.sensor.name}
                    </span>
                </td>
                <td>
                    <span class={"digit"}>
                        <b>{this.props.sensor.value.temperature.toFixed(1)}</b>
                    </span>
                </td>
                <td>
                    <span class={"label"}>
                        °C
                    </span>
                </td>
            </tr>,
            <tr key={"hum"}>
                <td>
                    <img src={"humidity.png"} height={32} alt={"humidity"}/>
                </td>
                <td>
                    <span className={"label"}>
                        {this.props.sensor.name}
                    </span>
                </td>
                <td>
                    <span class={"digit"}>
                        <b>{this.props.sensor.value.humidity.toFixed(1)}</b>
                    </span>
                </td>
                <td>
                    <span class={"label"}>
                        %
                    </span>
                </td>
            </tr>
        ]);
    }
}
export default DHTSensor;
