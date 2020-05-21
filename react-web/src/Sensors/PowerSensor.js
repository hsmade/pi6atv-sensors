import React, {Component} from 'react';

class PowerSensor extends Component {
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
            <tr>
                <td>
                    <img src={"electricity.png"} height={32} alt={"electricity"}/>
                </td>
                <td align={"right"}>
                    <span class="digit">
                        <b>{this.props.sensor.value.voltage.toFixed(1)}</b>
                    </span>
                    <span class="label">
                        &nbsp;V&nbsp;&nbsp;
                    </span>
                </td>
                <td>
                    <span className="digit">
                    <b>{current_value.toFixed(1)}</b>
                    </span>
                    <span class="label">
                        &nbsp;{current_sign}&nbsp;&nbsp;
                    </span>
                </td>
                <td>
                    <span className="digit">
                        <b>{power_value}</b>
                    </span>
                    <span class="label">
                        &nbsp;{power_sign}&nbsp;&nbsp;
                    </span>
                </td>
            </tr>
        );
    }
}
export default PowerSensor;
