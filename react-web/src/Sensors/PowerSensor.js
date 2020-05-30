import React, {Component} from 'react';

class PowerSensor extends Component {
    sign(value) {
        if (value < 1) {
            value = (value * 1000).toFixed(0)
            return [<span key={"value"} className="digit">{value}</span>,<span key={"sign"} className={"digit lowercase"}>&nbsp;m</span>]
        }

        if (value > 1000) {
            value = (value / 1000).toFixed(0)
            return [<span key={"value"} className="digit">{value}</span>,<span key={"sign"} className={"digit lowercase"}>&nbsp;k</span>]
        }

        return <span className="digit">{value.toFixed(1)}&nbsp;</span>
    }

    render() {
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
                        {this.sign(this.props.sensor.value.voltage)}
                    <span className="label">
                        V&nbsp;&nbsp;
                    </span>
                </td>
                <td align={"right"}>
                    {this.sign(this.props.sensor.value.current/1000)}
                    <span className="label">
                        A&nbsp;&nbsp;
                    </span>
                </td>
                <td align={"right"}>
                        {this.sign(this.props.sensor.value.power/1000)}
                    <span className="label">
                        W&nbsp;&nbsp;
                    </span>
                </td>
            </tr>
        );
    }
}
export default PowerSensor;
