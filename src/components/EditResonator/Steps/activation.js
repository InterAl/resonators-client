import React, {Component} from 'react';
import {Field} from 'redux-form';
import StepBase from './stepBase';
import ToggleField from '../../FormComponents/ToggleField';

class EditResonatorActivation extends Component {
    render() {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <Field name='activated'
                       component={ToggleField}
                       label='Activate resonator'
                />
                <Field name='sendMeCopy'
                       component={ToggleField}
                       label='Send me copies'
                />
            </div>
        );
    }
}

export default StepBase({
    noNext: true,
    noBack: true,
})(EditResonatorActivation);
