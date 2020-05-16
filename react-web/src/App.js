import React, {Component} from 'react';
import './App.css';
import BooleanSensor from "./Sensors/BooleanSensor";
import GaugeSensor from "./Sensors/GaugeSensor";
import PowerSensor from "./Sensors/PowerSensor";
import DHTSensor from "./Sensors/DHTSenssor";


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
                    return {name: sensor.name, component: <BooleanSensor sensor={sensor}/>}
                case "rpm":
                    return {name: sensor.name, component: <GaugeSensor sensor={sensor}/>}
                case "temperature":
                    return {name: sensor.name, component: <GaugeSensor sensor={sensor}/>}
                case "power":
                    return {name: sensor.name, component: <PowerSensor sensor={sensor}/>}
                case "dht22":
                    return {name: sensor.name, component: <DHTSensor sensor={sensor}/>}
                default:
                    return {name: sensor.name, component: <p>{sensor.name} ({sensor.type})</p>}
            }
        })
        return (
            <div className="App">
              <header className="App-header">
                  <ul>
                      {components.map(sensor =>
                          <li key={sensor.name}>
                              {sensor.component}
                          </li>
                      )}
                  </ul>
              </header>
            </div>
        );
    }
}

export default App;
