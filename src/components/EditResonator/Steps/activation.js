import React, {Component} from 'react';
import {Field} from 'redux-form';
import StepBase from './stepBase';
import ToggleField from '../../FormComponents/ToggleField';

class EditResonatorActivation extends Component {
    render() {
        return (
            <div>
                <Field name='activated'
                       component={ToggleField}
                       style={{top: 8, marginBottom: 16}}
                       label='Activate resonator'
                       labelPosition='right'
                />

                <Field name='sendMeCopy'
                       component={ToggleField}
                       style={{top: 8, marginBottom: 16}}
                       label='Send me a copy'
                       labelPosition='right'
                />
            </div>
        );
    }
}

export default StepBase({
    formName: 'EditResonatorActivation',
})(EditResonatorActivation);
