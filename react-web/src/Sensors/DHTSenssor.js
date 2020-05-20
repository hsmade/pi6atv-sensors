import React, {Component} from 'react';

class DHTSensor extends Component {
    render() {
        return (
            <div>
                <p>
                    <img src={"thermometer.png"} height={32} alt={"thermometer"}/>
                    &nbsp;
                    <span class="digit">
                        <b>{this.props.sensor.value.temperature.toFixed(1)}</b>
                    </span>
                    &nbsp;
                    <span class="label">
                        °C
                    </span>
                </p>
                <p>
                    <img src={"humidity.png"} height={32} alt={"humidity"}/>
                    &nbsp;
                    <span class="digit">
                        <b>{this.props.sensor.value.humidity.toFixed(1)}</b>
                    </span>
                    &nbsp;
                    <span class="label">
                        %
                    </span>
                </p>
            </div>
        );
    }
}
export default DHTSensor;
