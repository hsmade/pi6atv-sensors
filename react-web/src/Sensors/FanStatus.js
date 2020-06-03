import React, {Component} from 'react';

class FanStatus extends Component {
    render() {
        const sensor = this.props.sensor

        let statusIcon = "switch-off.png"
        if (this.props.status) {
            statusIcon = "switch-on.png"
        }

        let valueClasses = "digit"
        if ((sensor.value > sensor.max || sensor.value < sensor.min) && sensor.value !== -1) {
            valueClasses += " out-of-spec"
        }

        if (!this.props.status || sensor.value === -1) {
            sensor.value = "--"
        }

        return (
            <tr>
                <td>
                    <img src={"fan.png"} alt={"fan"} height={this.props.height/25}/>
                </td>
                <td>
                    &nbsp;<img src={statusIcon} alt={statusIcon} height={this.props.height/35}/>&nbsp;
                </td>
                <td>
                    <span className={"label"}>
                        {sensor.name}:
                    </span>
                </td>
                <td align={"right"}>
                    <span className={valueClasses}>
                        {sensor.value.toString().padStart(4)}
                    </span>
                </td>
                <td>
                    <span className={"label"}>
                        RPM
                    </span>
                </td>
            </tr>
        )
    }
}

export default FanStatus
