import React, {Component} from 'react';
import './App.css';
// import BooleanSensor from "./Sensors/BooleanSensor";
// import GaugeSensor from "./Sensors/GaugeSensor";
// import PowerSensor from "./Sensors/PowerSensor";
// import DHTSensor from "./Sensors/DHTSenssor";
import Speedometer from "./Sensors/Speedometer";
import FanStatus from "./Sensors/FanStatus";
import FluidPumpStatus from "./Sensors/FluidPumpStatus";


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
        }

        // console.log("state:", this.state)
        for (let sensor of this.state.sensors) {
            sensors[sensor.type][sensor.name] = sensor
        }
        // console.log("sensors:",sensors)

        let fans = []
        for (let key of Object.keys(sensors.rpm).sort()) {
            const sensor = sensors.rpm[key]
            // console.log("KEY:", sensor)
            fans.push(<FanStatus sensor={{
                name: sensor.name,
                value: sensor.value,
                min: sensor.min,
                max: sensor.max,
                status: sensors.status[sensor.name].value
            }}/>)
        }

        let flow = []
        console.log(sensors)
        for (let key of Object.keys(sensors.flow).sort()) {
            const sensor = sensors.flow[key]
            sensor.status = sensors.status[sensor.name].value
            sensor.voltage = sensors.power[sensor.name].value.voltage
            sensor.current = sensors.power[sensor.name].value.current
            sensor.power = sensors.power[sensor.name].value.power
            flow.push(<FluidPumpStatus sensor={sensor}/>)
        }



        // console.log(fans)
        // const components = sensors.map(sensor => {
        //     switch (sensor.type) {
        //         case "status":
        //             return {name: sensor.name, type: sensor.type, component: <BooleanSensor sensor={sensor}/>}
        //         case "rpm":
        //         case "temperature":
        //         case "flow":
        //             return {name: sensor.name, type: sensor.type, component: <GaugeSensor sensor={sensor}/>}
        //         case "power":
        //             return {name: sensor.name, type: sensor.type, component: <PowerSensor sensor={sensor}/>}
        //         case "dht22":
        //             return {name: sensor.name, type: sensor.type, component: <DHTSensor sensor={sensor}/>}
        //         default:
        //             return {name: sensor.name, type: sensor.type, component: <p>{sensor.name} ({sensor.type})</p>}
        //     }
        // })
        // const fan1 = {
        //     name: "@40 °C",
        //     status: true,
        //     value: 2000,
        //     min: 1900,
        //     max: 2100,
        // }
        // const fan2 = {
        //     name: "@50 °C",
        //     status: true,
        //     value: 2200,
        //     min: 1900,
        //     max: 2100,
        // }
        // const fan3 = {
        //     name: "@60 °C",
        //     status: false,
        //     value: 1999,
        //     min: 1900,
        //     max: 2100,
        // }

        return (
            <div className="App">
                  <div style={{position:"relative"}}>

                      <div class={"speedometer"}>
                        <Speedometer sensor={{"value": 15, "max":20, "min": 0}}/>
                      </div>

                      <div style={{position:"absolute", top:0, left:0}} id={"cooling"}>
                          <span class={"label"}>Cooling</span>
                          <table cellSpacing={"5px"}>
                              <tbody>
                              {fans}
                              <tr><td colSpan={5}><hr/></td></tr>
                              {flow}
                              </tbody>
                          </table>
                      </div>

                      <div id={"PA"}/>
                      <div id={"power supplies"} />
                      <div id={"temperatures"}/>


                      {/*<div style={{position:"absolute", bottom:100, left:120, textAlign:"left", fontSize:"22px"}}>*/}
                      {/*    {*/}
                      {/*        components.filter((value, index, array) => {*/}
                      {/*        return ["PA", "Mounting plate", "Fan1", "Fan2", "Fan3"].includes(value.name)*/}
                      {/*    }).map(sensor => sensor.component)*/}
                      {/*    }*/}
                      {/*</div>*/}
                      {/*<div style={{position:"absolute", bottom:400, left:350, textAlign:"center", fontSize:"22px"}}>*/}
                      {/*    {*/}
                      {/*        components.filter((value, index, array) => {*/}
                      {/*        return ["PA power supply","Main power supply"].includes(value.name)*/}
                      {/*    }).map(sensor => sensor.component)*/}
                      {/*    }*/}
                      {/*</div>*/}
                      {/*<div style={{position:"absolute", bottom:100, left:-300, textAlign:"left", fontSize:"22px"}}>*/}
                      {/*    {*/}
                      {/*        components.filter((value, index, array) => {*/}
                      {/*        return value.type === "status"*/}
                      {/*    }).map(sensor => sensor.component)*/}
                      {/*    }*/}
                      {/*</div>*/}
                      {/*<div style={{position:"absolute", bottom:100, right:-350, textAlign:"left", fontSize:"22px"}}>*/}
                      {/*    {*/}
                      {/*        components.filter((value, index, array) => {*/}
                      {/*            console.log(value)*/}
                      {/*        return value.type === "temperature"*/}
                      {/*    }).map(sensor => sensor.component)*/}
                      {/*    }*/}
                      {/*</div>*/}
                      {/*<div style={{position:"absolute", top:0, right:-170, textAlign:"left", fontSize:"22px"}}>*/}
                      {/*    {*/}
                      {/*        components.filter((value, index, array) => {*/}
                      {/*            console.log(value)*/}
                      {/*        return value.type === "dht22"*/}
                      {/*    }).map(sensor => sensor.component)*/}
                      {/*    }*/}
                      {/*</div>*/}
                      {/*<div style={{position:"absolute", top:0, left:-300, textAlign:"left", fontSize:"22px"}}>*/}
                      {/*    /!*{*!/*/}
                      {/*    /!*    components.filter((value, index, array) => {*!/*/}
                      {/*    /!*        console.log(value)*!/*/}
                      {/*    /!*    return value.type === "flow" || (value.type === "power" && !["PA power supply","Main power supply"].includes(value.name))*!/*/}
                      {/*    /!*}).map(sensor => sensor.component)*!/*/}
                      {/*    /!*}*!/*/}
                      {/*    <FanStatus sensor={fan1}/>*/}
                      {/*    <FanStatus sensor={fan2}/>*/}
                      {/*    <FanStatus sensor={fan3}/>*/}
                      {/*</div>*/}
                  </div>
            </div>
        );
    }
}

export default App;
