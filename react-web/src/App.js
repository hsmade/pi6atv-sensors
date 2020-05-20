import React, {Component} from 'react';
import './App.css';
import BooleanSensor from "./Sensors/BooleanSensor";
import GaugeSensor from "./Sensors/GaugeSensor";
import PowerSensor from "./Sensors/PowerSensor";
import DHTSensor from "./Sensors/DHTSenssor";
import Speedometer from "./Sensors/Speedometer";


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
        const { sensors } = this.state
        const components = sensors.map(sensor => {
            switch (sensor.type) {
                case "status":
                    return {name: sensor.name, type: sensor.type, component: <BooleanSensor sensor={sensor}/>}
                case "rpm":
                    return {name: sensor.name, type: sensor.type, component: <GaugeSensor sensor={sensor}/>}
                case "temperature":
                    return {name: sensor.name, type: sensor.type, component: <GaugeSensor sensor={sensor}/>}
                case "power":
                    return {name: sensor.name, type: sensor.type, component: <PowerSensor sensor={sensor}/>}
                case "dht22":
                    return {name: sensor.name, type: sensor.type, component: <DHTSensor sensor={sensor}/>}
                case "flow":
                    return {name: sensor.name, type: sensor.type, component: <GaugeSensor sensor={sensor}/>}
                default:
                    return {name: sensor.name, type: sensor.type, component: <p>{sensor.name} ({sensor.type})</p>}
            }
        })
        return (
            <div className="App">
              <header className="App-header">
                  <div style={{position:"relative"}}>
                      <Speedometer/>
                      <div style={{position:"absolute", bottom:100, left:120, textAlign:"left", fontSize:"22px"}}>
                          {
                              components.filter((value, index, array) => {
                              return ["PA", "Mounting plate", "Fan1 RPM", "Fan2 RPM", "Fan3 RPM"].includes(value.name)
                          }).map(sensor => sensor.component)
                          }
                      </div>
                      <div style={{position:"absolute", bottom:400, left:350, textAlign:"center", fontSize:"22px"}}>
                          {
                              components.filter((value, index, array) => {
                              return ["PA power supply","Main power supply"].includes(value.name)
                          }).map(sensor => sensor.component)
                          }
                      </div>
                      <div style={{position:"absolute", bottom:100, left:-300, textAlign:"left", fontSize:"22px"}}>
                          {
                              components.filter((value, index, array) => {
                              return value.type === "status"
                          }).map(sensor => sensor.component)
                          }
                      </div>
                      <div style={{position:"absolute", bottom:100, right:-350, textAlign:"left", fontSize:"22px"}}>
                          {
                              components.filter((value, index, array) => {
                                  console.log(value)
                              return value.type === "temperature"
                          }).map(sensor => sensor.component)
                          }
                      </div>
                      <div style={{position:"absolute", top:0, right:-170, textAlign:"left", fontSize:"22px"}}>
                          {
                              components.filter((value, index, array) => {
                                  console.log(value)
                              return value.type === "dht22"
                          }).map(sensor => sensor.component)
                          }
                      </div>
                      <div style={{position:"absolute", top:0, left:-300, textAlign:"left", fontSize:"22px"}}>
                          {
                              components.filter((value, index, array) => {
                                  console.log(value)
                              return value.type === "flow" || (value.type === "power" && !["PA power supply","Main power supply"].includes(value.name))
                          }).map(sensor => sensor.component)
                          }
                      </div>
                  </div>
                  {/*<ul>*/}
                  {/*    {components.map(sensor =>*/}
                  {/*        <li key={sensor.name}>*/}
                  {/*            {sensor.component}*/}
                  {/*        </li>*/}
                  {/*    )}*/}
                  {/*</ul>*/}
              </header>
            </div>
        );
    }
}

export default App;
