import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import {
    Step,
    StepLabel,
    StepContent
} from 'material-ui/Stepper';

class EditResonatorCriteria extends Component {
    render() {
        return (
            <form onSubmit={this.props.handleSubmit(this.props.onNext)}>
            </form>
        );
    }
}

function mapStateToProps(state) {
    return {
        initialValues: {
            title: 'foo'
        }
    };
}

export default connect(mapStateToProps)(reduxForm({
    form: 'EditResonatorCriteria'
})(EditResonatorCriteria));
