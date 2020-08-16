import ReactSpeedometer from "react-d3-speedometer"
import React, {Component} from 'react';

class Speedometer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.value < 0) { // ignore invalid values
            return prevState
        } else {
            return nextProps
        }
    }

    render() {
        let textColor="green"
        if (this.props.sensor.value > 12) {
            textColor="orange"
        }
        if (this.props.sensor.value < 10) {
            textColor="orange"
        }
        if (this.props.sensor.value < 8) {
            textColor="red"
        }

        // console.log("speedometer:", this.props.sensor.value, this.state.value, textColor)

        return (
            <div style={{width: "100%", height: "100%"}}>
            <ReactSpeedometer
                maxValue={this.props.sensor.max}
                minValue={this.props.sensor.min}
                value={this.props.sensor.value}
                // dimensionUnit="%"
                // startColor="green"
                // endColor="red"
                segments={28}
                maxSegmentLabels={14}
                segmentColors={["red","red","red","red","red","red","red","red","red","red","red","red","red","red","red","red","orange","orange","orange","orange","green","green","green","green","green","green","green","orange",]}
                textColor={textColor}
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
                valueFormat={" >4"}
                needleColor={textColor}
                forceRender={true}
                needleTransitionDuration={0}
            />
            </div>
        )
    }
}
export default Speedometer