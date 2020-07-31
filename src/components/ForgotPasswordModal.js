import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { actions as sessionActions } from '../actions/sessionActions';
import { connect } from 'react-redux';
import { Button, Dialog, DialogActions, DialogTitle, DialogContent, CircularProgress } from '@material-ui/core';
import TextBox from './FormComponents/TextBox';
import { reduxForm } from 'redux-form';
import * as validations from './FormComponents/Validations';


class ForgotPasswordModal extends Component {
    constructor() {
        super();

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(form) {
        this.props.recoverPassword(form);
    }

    render() {
        return (
            <Dialog open={this.props.open} onClose={this.props.onClose}>
                <DialogTitle>Password Recovery</DialogTitle>
                <DialogContent>
                    <form className="forgot-password-form">
                        <TextBox name="email" placeholder="Email" />
                        {this.props.forgotPasswordFailed && (
                            <div style={{ color: "red" }}>Password recovery failed</div>
                        )}
                        {this.props.forgotPasswordSpinner && <CircularProgress />}
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose}>Cancel</Button>
                    <Button
                        onClick={this.props.handleSubmit(this.handleSubmit)}
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={this.props.invalid}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

function mapStateToProps(state) {
    return {
        forgotPasswordFailed: state.session.forgotPasswordFailed,
        forgotPasswordSpinner: state.session.forgotPasswordSpinner
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        recoverPassword: sessionActions.recoverPassword
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
    reduxForm({
        form: 'forgotPassword',
        validate(form) {
            let errors = {};
            errors.email = validations.email(form.email) || validations.required(form.email);
            return errors;
        }
    })(ForgotPasswordModal),
);
