import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as navigationActions} from '../actions/navigationActions';
import {actions as sessionActions} from '../actions/sessionActions';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Button from 'material-ui/FlatButton';
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
        return (
            <Card className='loginForm col-sm-3'>
                <CardHeader title="Login" />
                <CardText className='cardText'>
                    <form onSubmit={this.props.handleSubmit}>
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
                                label='submit'
                                primary={true} />
                        </div>

                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <Button
                                type="button"
                                onTouchTap={this.props.showRegistrationModal}
                                className="registerBtn"
                                labelStyle={{fontSize: 12, padding: 0}}
                                label='Registration'
                            />
                            <Button
                                type="button"
                                onTouchTap={this.props.showForgotPasswordModal}
                                className="registerBtn"
                                labelStyle={{fontSize: 12, padding: 0}}
                                label='Forgot password?'
                            />
                        </div>
                        <div style={{width: '100%'}}>
                            <Button
                                type='button'
                                onTouchTap={this.handleGoogleLogin}
                                label='Sign in with Google'
                                icon={googleIcon}
                                style={{width: '100%', marginTop: 12}}
                            />
                        </div>
                    </form>
                </CardText>
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
