import React, {Component} from 'react';
import {Field} from 'redux-form';
import TextField from '../../FormComponents/TextField';
import StepBase from './stepBase';

class EditResonatorBasic extends Component {
    render() {
        return (
            <form onSubmit={this.props.handleSubmit(this.props.onNext)}>
                <Field name='title'
                    placeholder='Title'
                    type='text'
                    component={TextField} />

                <Field name='description'
                    placeholder='Description'
                    type='text'
                    component={TextField} />

                <Field name='link'
                    placeholder='Link'
                    type='text'
                    component={TextField} />
            </form>
        );
    }
}

export default StepBase({
    formName: 'EditResonatorBasic',
    validate(formData) {
        let errors = {};

        if (!formData.title)
            errors.title = 'Required';

        if (!formData.description)
            errors.description = 'Required';

        if (!formData.link)
            errors.link = 'Required';

        return errors;
    }
})(EditResonatorBasic);
