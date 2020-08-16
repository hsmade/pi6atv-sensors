import React, {Component} from 'react';
import './App.css';
import DHTSensor from "./Sensors/DHTSensor";
import Speedometer from "./Sensors/Speedometer";
import FanStatus from "./Sensors/FanStatus";
import FluidPumpStatus from "./Sensors/FluidPumpStatus";
import FluidDetection from "./Sensors/FluidDetection";
import GaugeSensor from "./Sensors/GaugeSensor";
import PowerSensor from "./Sensors/PowerSensor";
import CpuSensor from "./Sensors/CpuSensor";
import CabinetDoorSensor from "./Sensors/CabinetDoorSensor";


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
                const res = await fetch('sensors.json');
                const data = await res.json();
                this.setState({sensors: data})
            }, 1000);
        } catch(e) {
            console.log(e);
        }
    }

    render() {
        // dirty hack for bright theme
        let className = 'dark-theme'
        if (window.location.hash === "#white") {
            className = 'light-theme'
        }
        document.body.className = className

        let sensors = {
            rpm: {},
            status: {},
            flow: {},
            power: {},
            dht22: {},
            temperature: {},
            reverse_status: {},
            pa_power: {},
            temp_fan: {},
        }

        // list -> hashmap
        for (let sensor of this.state.sensors) {
            if (Object.keys(sensor).length) { // guard against empty objects
                if (sensor.type != null && sensor.name != null) {
                    sensors[sensor.type][sensor.name] = sensor
                }
            }
        }
        // console.log(sensors)

        let fans = []
        for (let key of Object.keys(sensors.rpm).sort((a, b) => (sensors.rpm[a].sort > sensors.rpm[b].sort) ? 1 : -1)) {
            if (key !== "Cpu") {
                fans.push(<FanStatus key={key} sensor={sensors.rpm[key]} status={sensors.status[key].value} height={this.state.height} width={this.state.width}/>)
            }
        }

        let flow = []
        for (let key of Object.keys(sensors.flow).sort()) {
            flow.push(<FluidPumpStatus key={key+"-s"} sensor={sensors.flow[key]} status={sensors.status[key].value} height={this.state.height} width={this.state.width}/>)
            flow.push(<FluidDetection key={key+"-d"} sensor={sensors.reverse_status["Fluid detection"]} height={this.state.height} width={this.state.width}/>)
        }

        let temperatures = []
        for (let key of Object.keys(sensors.temperature).sort((a, b) => (sensors.temperature[a].sort > sensors.temperature[b].sort) ? 1 : -1)) {
            temperatures.push(<GaugeSensor key={key} sensor={sensors.temperature[key]} height={this.state.height} width={this.state.width}/>)
        }

        let temphum = []
        for (let key of Object.keys(sensors.dht22).sort()) {
            if (sensors.dht22[key].value != null) {
                temphum.push(<DHTSensor key={key} sensor={sensors.dht22[key]} height={this.state.height} width={this.state.width}/>)
            }
        }

        let cpu = []
        for (let key of Object.keys(sensors.temp_fan)) {
            if (sensors.rpm[key]) {
                sensors.temp_fan[key].value.rpm = sensors.rpm[key].value
            } else {
                sensors.temp_fan[key].value.rpm = -1
            }
            cpu.push(<CpuSensor key={key} sensor={sensors.temp_fan[key]} height={this.state.height} width={this.state.width}/>)
        }

        let psus = []
        for (let key of Object.keys(sensors.power).sort((a, b) => (sensors.power[a].sort > sensors.power[b].sort) ? 1 : -1)) {
            psus.push(<PowerSensor key={key} sensor={sensors.power[key]} status={sensors.status[key].value} height={this.state.height} width={this.state.width}/>)
        }

        let PA = []
        try {
            PA.push(<Speedometer sensor={{"value": sensors.pa_power["PA"].value, "max": sensors.pa_power["PA"].max, "min": sensors.pa_power["PA"].min}} height={this.state.height} width={this.state.width}/>)
        } catch (e) {
            console.log("no PA sensors (yet): ", sensors.pa_power)
        }

        let door = []
        try {
            if (sensors.status["Door closed"] !== undefined) {
                door.push(<CabinetDoorSensor sensor={sensors.status["Door closed"]}/>)
            }
        } catch (e) {
            console.log("no Door sensors (yet): ", sensors.status)
        }

        return (
            <div className="App">
                  <div style={{position:"relative"}} className={"container"}>

                      <div className={"top-right"}>
                          <table cellSpacing={"1vw"}>
                              <tbody>
                              <tr><td colSpan={5}><span className={"label"}>liquid cooling</span><hr/></td></tr>
                              {fans}
                              <tr/>
                              </tbody>
                          </table>
                      </div>

                      <div className={"top-left"}>
                          <table cellSpacing={"1vw"}>
                              <tbody>
                              <tr><td colSpan={5}><span className={"label"}>liquid pump &ge; 40 °C</span><hr/></td></tr>
                              {flow}
                              </tbody>
                          </table>
                      </div>

                      <div className={"mid-left"}>
                          <table cellSpacing={"1vw"}>
                              <tbody>
                              <tr><td colSpan={5}><span className={"label"}>Thermometer</span><hr/></td></tr>
                              {temphum}
                              </tbody>
                          </table>
                      </div>

                      <div className={"mid-right"}>
                          <table cellSpacing={"1vw"}>
                              <tbody>
                              <tr><td colSpan={5}><span className={"label"}>RPi Cpu</span><hr/></td></tr>
                              {cpu}
                              </tbody>
                          </table>
                      </div>

                      <div className={"bottom-left"}>
                          <table cellSpacing={"1vw"}>
                              <tbody>
                              <tr><td colSpan={5}><span className={"label"}>Environment</span><hr/></td></tr>
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
                          {PA}
                      </div>

                      <div className={"cabinet-door"}>
                          {door}
                      </div>

                  </div>
            </div>
        );
    }
}

export default App;
