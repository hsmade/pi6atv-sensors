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
            pa_power: {},
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
        for (let key of Object.keys(sensors.temperature).sort((a, b) => (a.sort > b.sort) ? 1 : -1)) {
            temperatures.push(<GaugeSensor key={key} sensor={sensors.temperature[key]} height={this.state.height} width={this.state.width}/>)
        }

        let temphum = []
        for (let key of Object.keys(sensors.dht22).sort()) {
            temphum.push(<DHTSensor key={key} sensor={sensors.dht22[key]} height={this.state.height} width={this.state.width}/>)
        }

        let psus = []
        // try {
        //     psus.push(<PowerSensor key={"Mains"} sensor={sensors.power["Mains"]} status={sensors.status["Mains"].value} height={this.state.height} width={this.state.width}/>)
        //     psus.push(<PowerSensor key={"Pump"} sensor={sensors.power["Pump"]} status={sensors.status["Pump"].value} height={this.state.height} width={this.state.width}/>)
        //     psus.push(<PowerSensor key={"MX"} sensor={sensors.power["MX"]} status={sensors.status["MX"].value} height={this.state.height} width={this.state.width}/>)
        //     psus.push(<PowerSensor key={"PA"} sensor={sensors.power["PA"]} status={sensors.status["PA"].value} height={this.state.height} width={this.state.width}/>)
        // } catch (e) {
        //  console.log("no power sensors (yet): ", sensors.power)
        // }

        for (let key of Object.keys(sensors.power).sort((a, b) => (a.sort > b.sort) ? 1 : -1)) {
            psus.push(<PowerSensor key={key} sensor={sensors.power[key]} status={sensors.status[key].value} height={this.state.height} width={this.state.width}/>)
        }

        let PA = []
        try {
            PA.push(<Speedometer sensor={{"value": sensors.pa_power["PA"].value, "max": sensors.pa_power["PA"].max, "min": sensors.pa_power["PA"].min}} height={this.state.height} width={this.state.width}/>
            )
        } catch (e) {
            console.log("no PA sensors (yet): ", sensors.pa_power)
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

                      <div className={"mid-left"}>
                          <table cellSpacing={"1vw"}>
                              <tbody>
                              <tr><td colSpan={5}><span className={"label"}>Thermometer</span><hr/></td></tr>
                              {temphum}
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
                          {PA}
                      </div>

                  </div>
            </div>
        );
    }
}

export default App;
