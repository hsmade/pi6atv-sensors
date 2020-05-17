import React, {Component} from 'react';
// import Switch from '@material-ui/core/Switch';
// import FormGroup from '@material-ui/core/FormGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import { withStyles } from '@material-ui/core/styles';
// import { green, red } from '@material-ui/core/colors';

// const GreenSwitch = withStyles({
//     switchBase: {
//         color: red[500],  // FIXME: doesn't work
//         '&$checked': {
//             color: green[500],
//         },
//         '&$checked + $track': {
//             backgroundColor: green[500],
//         },
//     },
//     checked: {},
//     track: {},
// })(Switch);

class BooleanSensor extends Component {
    render() {
        let icon = ""
        switch (this.props.sensor.value) {
            case true: icon = "switch-on.png"; break
            case false: icon = "switch-off.png"; break
            default: break
        }
        return (
            <div>
                <p style={{fontFamily: 'digital-7-italic', color: "blue"}}>
                    <img src={icon} height={32} color={"blue"} alt={icon}/>
                    &nbsp;
                    <b>{this.props.sensor.name}</b>
                    &nbsp;
                </p>
            </div>
        )
    }
}

export default BooleanSensor;
