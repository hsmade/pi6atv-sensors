import React, {Component} from 'react';

class GaugeSensor extends Component {
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
            <tr>
                <td>
                    <img src={icon} height={this.props.height/25} alt={icon}/>
                </td>
                <td>
                    <span className="label">
                        {this.props.sensor.name}
                    </span>
                </td>
                <td align={"right"}>
                    <span className="digit">
                        <b>{value}</b>
                    </span>
                </td>
                <td>
                    <span className="label">
                        {sign}
                    </span>
                </td>
            </tr>
        );
    }
}
export default GaugeSensor;
