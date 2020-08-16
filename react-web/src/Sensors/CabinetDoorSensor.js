import React, {Component} from 'react';

class CabinetDoorSensor extends Component {
    render() {
        console.log("CABINET", this.props)
        let text ="cabinet open"
        let className = "red"
        if (this.props.sensor.value) {
            text ="cabinet closed"
            className = ""
        }

        return (
            <span className={className}>{text}</span>
        )
    }
}

export default CabinetDoorSensor
