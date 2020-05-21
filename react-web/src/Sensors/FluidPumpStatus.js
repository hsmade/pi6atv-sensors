import React, {Component} from 'react';

/*
 Properties:
   sensor:
     name: string
     value: number
     status: bool
     min: number
     max: number
 */

class FluidPumpStatus extends Component {
    render() {
        const sensor = this.props.sensor

        let statusIcon = "switch-off.png"
        if (sensor.status) {
            statusIcon = "switch-on.png"
        }

        let statusColor = "blue"
        if ((sensor.value > sensor.max || sensor.value < sensor.min) && sensor.value !== -1) {
            statusColor = "red"
        }

        if (!sensor.status || sensor.value === -1) {
            sensor.value = "--"
        } else {
            sensor.value = sensor.value.toFixed(1)
        }

        return ([
            <tr key={"pump"}>
                <td>
                    <img src={"fan.png"} alt={"fan"} height={32}/>
                </td>
                <td>
                    <img src={statusIcon} alt={statusIcon} height={20}/>
                </td>
                <td>
                    <span class={"label"}>
                        {sensor.name}:
                    </span>
                </td>
                <td align={"right"}>
                    <span class={"digit"} style={{color: statusColor}}>
                        {sensor.value}
                    </span>
                </td>
                <td>
                    <span className={"label"}>
                        L/min
                    </span>
                </td>
            </tr>,
            // <tr/>,
            // <tr key={"power"}>
            //     <td>
            //     </td>
            //     <td>
            //         <img src={"electricity.png"} alt={"fan"} height={20}/>
            //     </td>
            //     <td colSpan={3}>
            //         <span className={"digit"}>
            //             {sensor.voltage.toFixed(1)}
            //         </span>
            //         <span className={"label"}>
            //             &nbsp;V&nbsp;&nbsp;
            //         </span>
            //         <span className={"digit"}>
            //             {(sensor.current/1000).toFixed(1)}
            //         </span>
            //         <span className={"label"}>
            //             &nbsp;A&nbsp;&nbsp;
            //         </span>
            //         <span className={"digit"}>
            //             {(sensor.power/1000).toFixed(1)}
            //         </span>
            //         <span className={"label"}>
            //             &nbsp;W
            //         </span>
            //     </td>
            // </tr>
        ])
    }
}

export default FluidPumpStatus
