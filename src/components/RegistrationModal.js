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

    render() {
        return (
            <Dialog open={this.props.open} onClose={this.props.onClose}>
                <DialogTitle>Register</DialogTitle>
                <DialogContent>
                    <form autoComplete="off" className="registration-form">
                        <TextBox type="email" name="email" label="Email" />
                        <TextBox name="name" label="Name" />
                        <TextBox type="password" name="password" label="Password" />
                        <TextBox type="password" name="confirmPassword" label="Confirm Password" />
                        {this.props.registrationFailed && <div className="error">Registration failed</div>}
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={this.props.handleSubmit(this.handleSubmit)}
                        className="registration-submit"
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={this.props.invalid}
                    >
                        Register
                    </Button>
                </DialogActions>
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
