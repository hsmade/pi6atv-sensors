import React, {Component} from 'react';

class GaugeSensor extends Component {
    render() {
        let icon = "";
        let sign = "";
        switch (this.props.sensor.type) {
            case "temperature": icon = "thermometer.png"; sign = "°C"; break
            case "rpm": icon = "fan.png"; sign = "rpm"; break
            default: break
        }
        let value = this.props.sensor.value
        if (value > 0) {
            value = value.toFixed(1)
        }
        return (
            <div>
                <p>
                    <img src={icon} height={32} alt={icon}/>
                    &nbsp;
                    <span class="digit">
                        <b>{value}</b>
                    </span>
                    &nbsp;
                    <span class="label">
                        {sign}
                    </span>
                    &nbsp;
                    <span className="label">
                        {this.props.sensor.name}
                    </span>
                </p>
            </div>
        );
    }
}
export default GaugeSensor;
