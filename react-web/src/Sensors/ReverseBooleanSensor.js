import React, {Component} from 'react';

class ReverseBooleanSensor extends Component {
    render() {
        let icon = ""
        switch (this.props.sensor.value) {
            case true: icon = "switch-off.png"; break
            case false: icon = "switch-on.png"; break
            default: break
        }
        return (
            <div>
                <p>
                    <img src={icon} height={32} alt={icon}/>
                    &nbsp;
                    <span className="label">
                        <b>{this.props.sensor.name}</b>
                    </span>
                    &nbsp;
                </p>
            </div>
        )
    }
}

export default ReverseBooleanSensor;
