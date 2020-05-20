import ReactSpeedometer from "react-d3-speedometer"
import React, {Component} from 'react';

class Speedometer extends Component {

    render() {
        return (
            <div style={{width: "100%", height: "600px"}}>
            <ReactSpeedometer
                maxValue={this.props.sensor.max}
                minValue={this.props.sensor.min}
                value={this.props.sensor.value}
                needleColor="blue"
                startColor="green"
                endColor="red"
                segments={10}
                textColor="blue"
                labelFontSize="26px"
                valueTextFontSize="32px"
                ringWidth={1}
                // paddingHorizontal={17}
                paddingVertical={17}
                // dimensionUnit={"em"}
                width={900}
                // fluidWidth={true}
                height={600}
                currentValueText={"PA: #{value}W"}
                currentValuePlaceholderStyle={"#{value}W"}
            />
            </div>
        )
    }
}
export default Speedometer