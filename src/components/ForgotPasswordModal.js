import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { actions as sessionActions } from '../actions/sessionActions';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextBox from './FormComponents/TextBox';
import { reduxForm } from 'redux-form';
import * as validations from './FormComponents/Validations';
import CircularProgress from 'material-ui/CircularProgress';

class ForgotPasswordModal extends Component {
    constructor() {
        super();

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(form) {
        this.props.recoverPassword(form);
    }

    renderModalButtons() {
        return [
            <FlatButton
                onClick={this.props.onClose}
                label="Cancel"
                primary={true}
            />,
            <FlatButton
                onClick={this.props.handleSubmit(this.handleSubmit)}
                type='submit'
                label="Submit"
                primary={true}
                keyboardFocused={true}
            />
        ];
    }

    render() {
        return (
            <Dialog
                open={this.props.open}
                title='Password Recovery'
                modal={false}
                actions={this.renderModalButtons()}
                onRequestClose={this.props.onClose}
            >
                <form className='forgot-password-form'>
                    <TextBox name='email' placeholder='Email' />
                    {this.props.forgotPasswordFailed &&
                        <div style={{ color: 'red' }}>
                            Password recovery failed
                    </div>}
                    {this.props.forgotPasswordSpinner &&
                        <CircularProgress />}
                </form>
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
