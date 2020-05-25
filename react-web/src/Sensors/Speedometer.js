import ReactSpeedometer from "react-d3-speedometer"
import React, {Component} from 'react';

class Speedometer extends Component {
    render() {
        return (
            <div style={{width: "100%", height: "100%"}}>
            <ReactSpeedometer
                maxValue={this.props.sensor.max}
                minValue={this.props.sensor.min}
                value={this.props.sensor.value}
                needleColor="blue"
                // dimensionUnit="%"
                // startColor="green"
                // endColor="red"
                segments={20}
                maxSegmentLabels={10}
                segmentColors={["red","red","red","red","red","red","red","red","red","red","red","red","orange","orange","green","green","orange","orange","red","red",]}
                textColor="blue"
                labelFontSize="1.2vw"
                valueTextFontSize="2vw"
                ringWidth={1}
                // paddingHorizontal={17}
                paddingVertical={this.props.height/50}
                // dimensionUnit={"em"}
                width={this.props.width * 0.5}
                // fluidWidth={true}
                height={this.props.height * 0.8}
                currentValueText={"PA Output: #{value} W"}
                currentValuePlaceholderStyle={"#{value}"}
            />
            </div>
        )
    }
}
export default Speedometer