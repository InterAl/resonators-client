import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { actions as sessionActions } from '../actions/sessionActions';
import { connect } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import TextBox from './FormComponents/TextBox';
import { reduxForm } from 'redux-form';
import * as validations from './FormComponents/Validations';
import './RegistrationModal.scss';

class RegistrationModal extends Component {
    constructor() {
        super();

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(form) {
        this.props.register(form);
    }

    renderModalButtons() {
        return [
            <Button
                onClick={this.props.onClose}
                color="primary">
                Cancel
            </Button>,
            <Button
                onClick={this.props.handleSubmit(this.handleSubmit)}
                className='registration-submit'
                type='submit'
                color="primary"
                keyboardFocused={true}>
                Register
            </Button>
        ];
    }

    render() {
        return (
            <Dialog open={this.props.open} onClose={this.props.onClose}>
                <DialogTitle>Register</DialogTitle>
                <DialogContent>
                    <form autoComplete={false} className='registration-form'>
                        <TextBox autocorrect="off" type='email' name='email' placeholder='Email' />
                        <TextBox name='name' placeholder='Name' />
                        <TextBox type='password' name='password' placeholder='Password' />
                        <TextBox type='password' name='confirmPassword' placeholder='Confirm Password' />
                        {this.props.registrationFailed &&
                            <div className='error'>Registration failed</div>}
                    </form>
                </DialogContent>
                <DialogActions>{this.renderModalButtons()}</DialogActions>
            </Dialog>
        );
    }
}

function mapStateToProps(state) {
    return {
        registrationFailed: state.session.registrationFailed
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        register: sessionActions.register
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
    reduxForm({
        form: 'registration',
        validate(form) {
            let errors = {};

            errors.confirmPassword = validations.required(form.confirmPassword);

            if (form.password !== form.confirmPassword)
                errors['confirmPassword'] = 'Passwords do not match';

            errors.name = validations.required(form.name);
            errors.email = validations.email(form.email) || validations.required(form.email);
            errors.password = validations.required(form.password);

            return errors;
        }
    })(RegistrationModal),
);
