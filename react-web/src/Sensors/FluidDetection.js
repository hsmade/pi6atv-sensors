import React, {Component} from 'react';

class FluidDetection extends Component {
    render() {
        let text = "No water detected"
        let style = {}
        if (this.props.sensor.value) {
            text = "Water detected!"
            style = {color: "red"}
        }
        return (
            <tr>
                <td>
                    <img src={"water.png"} alt={"water"} height={this.props.height/25}/>
                </td>
                <td colSpan={4}>
                <span className={"label"} style={style}>{text}</span>
                </td>
            </tr>
        )
    }
}

export default FluidDetection