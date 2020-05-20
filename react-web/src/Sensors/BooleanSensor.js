import React, {Component} from 'react';

class BooleanSensor extends Component {
    render() {
        let icon = ""
        switch (this.props.sensor.value) {
            case true: icon = "switch-on.png"; break
            case false: icon = "switch-off.png"; break
            default: break
        }
        return (
            <div>
                <p>
                    <img src={icon} height={32} alt={icon}/>
                    &nbsp;
                    <span class="label">
                        <b>{this.props.sensor.name}</b>
                    </span>
                    &nbsp;
                </p>
            </div>
        )
    }
}

export default BooleanSensor;
