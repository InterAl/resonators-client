import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as navigationActions} from '../actions/navigationActions';
import {actions as sessionActions} from '../actions/sessionActions';
import {Card, CardHeader, CardContent, Button} from '@material-ui/core';
import { Field, reduxForm } from 'redux-form';
import TextField from './FormComponents/TextField';
import googleIcon from './Icons/GoogleIcon';
import './LoginForm.scss';
class LoginForm extends Component {
    constructor() {
        super();

        this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
    }

    handleGoogleLogin() {
        this.props.googleLogin();
    }

    render() {
        const isLoginFormRequired = false;
        return (
            <Card className='loginForm col-sm-3'>
                {isLoginFormRequired && <CardHeader title="Login" />}
                <CardContent className='cardText'>
                    {isLoginFormRequired && <form onSubmit={this.props.handleSubmit}>
                        <Field type='email' name='email' component={TextField}
                               props={{ placeholder: 'Email' }}
                        />
                        <br/>
                        <Field type='password' name='password' component={TextField}
                               props={{ placeholder: 'Password' }}
                        />
                        {this.props.submitFailed && 'Login failed'}
                        <div className='submitBtnWrapper'>
                            <Button
                                type="submit"
                                className='submitBtn'
                                color="primary">
                                    submit
                                </Button>
                        </div>

                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <Button
                                type="button"
                                onClick={this.props.showRegistrationModal}
                                className="registerBtn">
                                Registration
                            </Button>
                            <Button
                                type="button"
                                onClick={this.props.showForgotPasswordModal}
                                className="registerBtn">
                                Forgot password?
                            </Button>
                        </div>
                    </form>}
                    {!isLoginFormRequired && <div className="signInDesclaimer">
                        <span>Dear Psysession user,
                            Starting Jan 1st 2019, Login and Registration to Psysession.com is enabled with a Google account only.

                        </span>
                    </div>}
                    <div style={{width: '100%'}}>
                            <Button
                                type='button'
                                onClick={this.handleGoogleLogin}
                                startIcon={googleIcon}
                                style={{width: '100%', marginTop: 12}}>
                                Sign in with Google
                            </Button>
                        </div>
                </CardContent>
            </Card>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        showRegistrationModal: () => navigationActions.showModal({
            name: 'registration'
        }),

        showForgotPasswordModal: () => navigationActions.showModal({
            name: 'forgotPassword'
        }),

        googleLogin: sessionActions.googleLogin
    }, dispatch);
}

export default connect(null, mapDispatchToProps)(reduxForm({
    form: 'login'
})(LoginForm));
