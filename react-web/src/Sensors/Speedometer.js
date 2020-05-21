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
                // startColor="green"
                // endColor="red"
                segments={20}
                maxSegmentLabels={10}
                segmentColors={["red","red","red","red","red","red","red","red","red","red","red","red","orange","orange","green","green","orange","orange","red","red",]}
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