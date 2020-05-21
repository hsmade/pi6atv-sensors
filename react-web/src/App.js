import React, {Component} from 'react';
import './App.css';
// import BooleanSensor from "./Sensors/BooleanSensor";
// import GaugeSensor from "./Sensors/GaugeSensor";
// import PowerSensor from "./Sensors/PowerSensor";
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
        };
    }

    componentDidMount() {
        try {
            setInterval(async () => {
                const res = await fetch('/sensors.json');
                const data = await res.json();
                this.setState({ sensors: data })
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

        for (let sensor of this.state.sensors) {
            sensors[sensor.type][sensor.name] = sensor
        }
        // console.log("input:",this.state.sensors)
        // console.log("sensors:",sensors)

        let fans = []
        for (let key of Object.keys(sensors.rpm).sort()) {
            const sensor = sensors.rpm[key]
            fans.push(<FanStatus sensor={{
                name: sensor.name,
                value: sensor.value,
                min: sensor.min,
                max: sensor.max,
                status: sensors.status[sensor.name].value
            }}/>)
        }

        let flow = []
        for (let key of Object.keys(sensors.flow).sort()) {
            const sensor = sensors.flow[key]
            sensor.status = sensors.status[sensor.name].value
            // sensor.voltage = sensors.power[sensor.name].value.voltage
            // sensor.current = sensors.power[sensor.name].value.current
            // sensor.power = sensors.power[sensor.name].value.power
            flow.push(<FluidPumpStatus sensor={sensor}/>)
            flow.push(<FluidDetection sensor={sensors.reverse_status["Fluid detection"]}/>)
        }

        let temperatures = []
        for (let key of Object.keys(sensors.temperature).sort()) {
            temperatures.push(<GaugeSensor sensor={sensors.temperature[key]}/>)
        }
        for (let key of Object.keys(sensors.dht22).sort()) {
            temperatures.push(<DHTSensor sensor={sensors.dht22[key]}/>)
        }

        let psus = []
        for (let key of Object.keys(sensors.power).sort()) {
            psus.push(<PowerSensor sensor={sensors.power[key]} status={sensors.status[key]}/>)
        }

        return (
            <div className="App">
                  <div style={{position:"relative"}}>

                      <div class={"speedometer"}>
                        <Speedometer sensor={{"value": 15, "max":20, "min": 0}}/>
                          // PA (power (GPI-26), temp) -> in de dial
                      </div>

                      <div style={{position:"absolute", top:0, left:0}} id={"air cooling"}>
                          <table cellSpacing={"5px"}>
                              <tbody>
                              <tr><td colSpan={5}><span className={"label"}>Air Cooling</span><hr/></td></tr>
                              {fans}
                              <tr/>
                              </tbody>
                          </table>
                      </div>

                      <div style={{position:"absolute", bottom:0, left:0}} id={"water cooling"}>
                          <table cellSpacing={"5px"}>
                              <tbody>
                              <tr><td colSpan={5}><span className={"label"}>Water Cooling</span><hr/></td></tr>
                              {flow}
                              </tbody>
                          </table>
                      </div>

                      <div style={{position:"absolute", top:0, right:0}} id={"temperatures"}>
                          <table cellSpacing={"5px"}>
                              <tbody>
                              <tr><td colSpan={5}><span className={"label"}>Temperatures</span><hr/></td></tr>
                              {temperatures}
                              </tbody>
                          </table>
                      </div>

                      <div style={{position:"absolute", bottom:0, right:"50%"}} id={"psus"}>
                          <table cellSpacing={"5px"}>
                              <tbody>
                              <tr><td colSpan={5}><span className={"label"}>PSUs</span><hr/></td></tr>
                              {psus}
                              </tbody>
                          </table>
                      </div>
                  </div>
            </div>
        );
    }
}

export default App;
