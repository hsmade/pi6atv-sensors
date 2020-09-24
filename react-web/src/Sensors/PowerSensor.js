import React, {Component} from 'react';

class PowerSensor extends Component {
    valueFormat(value, min, max) {
        let classNames = "digit"
        if ((min > 0 && value < min) || (max > 0 && value > max)) {
            classNames += " out-of-spec"
        }

        if (value < 1) {
            value = (value * 1000).toFixed(0)
            return [<span key={"value"} className={classNames}>{value}</span>,<span key={"sign"} className={"label lowercase"}>&nbsp;m</span>]
        }

        if (value >= 1000) {
            value = (value / 1000).toFixed(0)
            return [<span key={"value"} className={classNames}>{value}</span>,<span key={"sign"} className={"label lowercase"}>&nbsp;k</span>]
        }

        if (value >= 100) {
            return <span className={classNames}>{value.toFixed(1).toString().padStart(4, " ")}&nbsp;</span>
        }
        return <span className={classNames}>{value.toFixed(1)}&nbsp;</span>
    }

    render() {
        // console.log(this.props.sensor)
        let statusIcon = "switch-off.png"
        if (this.props.status) {
            statusIcon = "switch-on.png"
        }
        return (
            <tr>
                <td>
                    <img src={"electricity.png"} height={this.props.height/25} alt={"electricity"}/>
                </td>
                <td>
                    &nbsp;<img src={statusIcon} alt={statusIcon} height={this.props.height/35}/>&nbsp;
                </td>
                <td>
                    <span className="label">
                        {this.props.sensor.name}
                    </span>
                </td>
                <td align={"right"}>
                        {this.valueFormat(this.props.sensor.value.voltage, this.props.sensor.value.min_voltage, this.props.sensor.value.max_voltage)}
                    <span className="label">
                        V&nbsp;&nbsp;
                    </span>
                </td>
                <td align={"right"}>
                    {this.valueFormat(this.props.sensor.value.current/1000, this.props.sensor.value.min_current/1000, this.props.sensor.value.max_current/1000)}
                    <span className="label">
                        A&nbsp;&nbsp;
                    </span>
                </td>
                <td align={"right"}>
                    {this.valueFormat(this.props.sensor.value.power/1000)}
                    <span className="label">
                        W&nbsp;&nbsp;
                    </span>
                </td>
            </tr>
        );
    }
}
export default PowerSensor;
