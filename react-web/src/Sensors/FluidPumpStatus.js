import React, {Component} from 'react';

class FluidPumpStatus extends Component {
    render() {
        const sensor = this.props.sensor

        let statusIcon = "switch-off.png"
        if (this.props.status) {
            statusIcon = "switch-on.png"
        }

        let style = {}
        if ((sensor.value > sensor.max || sensor.value < sensor.min) && sensor.value !== -1) {
            style = {color: "red"}
        }

        if (!this.props.status || sensor.value === -1) {
            sensor.value = "00"
            style = {color: "red"}
        } else if (typeof(sensor.value) === "number") {
            sensor.value = sensor.value.toFixed(1)
        }

        return ([
            <tr key={"pump"}>
                <td>
                    <img src={"fan.png"} alt={"fan"} height={this.props.height/25}/>
                </td>
                <td>
                    &nbsp;<img src={statusIcon} alt={statusIcon} height={this.props.height/35}/>&nbsp;
                </td>
                <td>
                    <span className={"label"}>
                        {sensor.name}:&nbsp;
                    </span>
                </td>
                <td align={"right"}>
                    <span className={"digit"} style={style}>
                        {sensor.value}
                    </span>
                </td>
                <td>
                    <span className={"label"}>
                        &nbsp;L/
                    </span>
                    <span className={"label lowercase"}>
                       min
                    </span>
                </td>
            </tr>,
        ])
    }
}

export default FluidPumpStatus
