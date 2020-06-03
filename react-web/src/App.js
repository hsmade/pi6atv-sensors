import React, {Component} from 'react';
import './App.css';
import DHTSensor from "./Sensors/DHTSensor";
import Speedometer from "./Sensors/Speedometer";
import FanStatus from "./Sensors/FanStatus";
import FluidPumpStatus from "./Sensors/FluidPumpStatus";
import FluidDetection from "./Sensors/FluidDetection";
import GaugeSensor from "./Sensors/GaugeSensor";
import PowerSensor from "./Sensors/PowerSensor";


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sensors: [],
            width: window.innerWidth,
            height: window.innerHeight
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ sensors: this.state.sensors, width: window.innerWidth, height: window.innerHeight });
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        try {
            setInterval(async () => {
                const res = await fetch('/sensors.json');
                const data = await res.json();
                this.setState({sensors: data})
            }, 1000);
        } catch(e) {
            console.log(e);
        }
    }

    render() {
        let sensors = {
            rpm: {},
            status: {},
            flow: {},
            power: {},
            dht22: {},
            temperature: {},
            reverse_status: {},
        }

        // list -> hashmap
        for (let sensor of this.state.sensors) {
            if (Object.keys(sensor).length) { // guard against empty objects
                sensors[sensor.type][sensor.name] = sensor
            }
        }

        let fans = []
        for (let key of Object.keys(sensors.rpm).sort()) {
            fans.push(<FanStatus key={key} sensor={sensors.rpm[key]} status={sensors.status[key].value} height={this.state.height} width={this.state.width}/>)
        }

        let flow = []
        for (let key of Object.keys(sensors.flow).sort()) {
            flow.push(<FluidPumpStatus key={key+"-s"} sensor={sensors.flow[key]} status={sensors.status[key].value} height={this.state.height} width={this.state.width}/>)
            flow.push(<FluidDetection key={key+"-d"} sensor={sensors.reverse_status["Fluid detection"]} height={this.state.height} width={this.state.width}/>)
        }

        let temperatures = []
        for (let key of Object.keys(sensors.temperature).sort()) {
            temperatures.push(<GaugeSensor key={key} sensor={sensors.temperature[key]} height={this.state.height} width={this.state.width}/>)
        }
        for (let key of Object.keys(sensors.dht22).sort()) {
            temperatures.push(<DHTSensor key={key} sensor={sensors.dht22[key]} height={this.state.height} width={this.state.width}/>)
        }

        // FIXME:  mains, daaronder de pomp, dan de PA en als laatste de mixer
        let psus = []
        for (let key of Object.keys(sensors.power).sort()) {
            psus.push(<PowerSensor key={key} sensor={sensors.power[key]} status={sensors.status[key].value} height={this.state.height} width={this.state.width}/>)
        }

        return (
            <div className="App">
                  <div style={{position:"relative"}} className={"container"}>

                      <div className={"top-right"}>
                          <table cellSpacing={"1vw"}>
                              <tbody>
                              <tr><td colSpan={5}><span className={"label"}>Air Cooling</span><hr/></td></tr>
                              {fans}
                              <tr/>
                              </tbody>
                          </table>
                      </div>

                      <div className={"top-left"}>
                          <table cellSpacing={"1vw"}>
                              <tbody>
                              <tr><td colSpan={5}><span className={"label"}>Water Cooling</span><hr/></td></tr>
                              {flow}
                              </tbody>
                          </table>
                      </div>

                      <div className={"bottom-left"}>
                          <table cellSpacing={"1vw"}>
                              <tbody>
                              <tr><td colSpan={5}><span className={"label"}>Temperatures</span><hr/></td></tr>
                              {temperatures}
                              </tbody>
                          </table>
                      </div>

                      <div className={"bottom-right"}>
                          <table cellSpacing={"1vw"}>
                              <tbody>
                              <tr><td colSpan={6}><span className={"label"}>PSUs</span><hr/></td></tr>
                              {psus}
                              </tbody>
                          </table>
                      </div>

                      <div className={"speedometer"}>
                          <Speedometer sensor={{"value": 15, "max": 20, "min": 0}} height={this.state.height} width={this.state.width}/>
                          {/*PA (power (GPI-26), temp) -> in de dial*/}
                      </div>

                  </div>
            </div>
        );
    }
}

export default App;
