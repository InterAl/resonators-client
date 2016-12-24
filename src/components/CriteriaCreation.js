import React, {Component} from 'react';
import TextField from './FormComponents/TextField';
import {reduxForm, Field} from 'redux-form';

class CriteriaCreation extends Component {
    render() {
        return (
            <div>
                <form>
                    <Field placeholder='clinic'
                           component={TextField}
                    />
                </form>
            </div>
        );
    }
}

export default reduxForm({

})(CriteriaCreation);
