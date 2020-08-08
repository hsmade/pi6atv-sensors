import React, {Component} from 'react';
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";

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
