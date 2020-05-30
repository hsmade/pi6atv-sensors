import React, {Component} from 'react';

class FluidDetection extends Component {
    render() {
        let text = "Water detected!"
        let color = "red"
        if (!this.props.sensor.value) {
            text = "No water detected"
            color = "green"
        }
        return (
            <tr>
                <td>
                    <img src={"water.png"} alt={"water"} height={this.props.height/25}/>
                </td>
                <td colSpan={4}>
                <span className={"label"} style={{color: color}}>{text}</span>
                </td>
            </tr>
        )
    }
}

export default FluidDetection