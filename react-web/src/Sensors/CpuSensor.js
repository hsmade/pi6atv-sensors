import React, {Component} from 'react';

class CpuSensor extends Component {
    render() {
        const sensor = this.props.sensor
        console.log("cpusensor", sensor)

        let statusIcon = "switch-off.png"
        if (sensor.value.fan) {
            statusIcon = "switch-on.png"
        }

        let valueClasses = "digit"
        if ((sensor.value.temp > sensor.max) && sensor.value.temp !== -1) {
            valueClasses += " out-of-spec"
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
                        {sensor.value.temp.toString().padStart(4)}
                    </span>
                </td>
                <td>
                    <span className={"label"}>
                        °C
                    </span>
                </td>
            </tr>
        )
    }
}

export default CpuSensor
