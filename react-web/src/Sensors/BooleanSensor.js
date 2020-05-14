import React, {Component} from 'react';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors';

const GreenSwitch = withStyles({
    switchBase: {
        color: red[500],  // FIXME: doesn't work
        '&$checked': {
            color: green[500],
        },
        '&$checked + $track': {
            backgroundColor: green[500],
        },
    },
    checked: {},
    track: {},
})(Switch);

class BooleanSensor extends Component {
    render() {
        return (
        <FormGroup row>
            <FormControlLabel
                disabled
                control={<GreenSwitch checked={this.props.sensor.value} color="primary"/>}
                label={this.props.sensor.name}
            />
        </FormGroup>
        )
    }
}

export default BooleanSensor;
