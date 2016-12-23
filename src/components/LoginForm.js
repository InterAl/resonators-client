import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Button from 'material-ui/FlatButton';
import { Field, reduxForm } from 'redux-form';
import TextField from './FormComponents/TextField';
import './LoginForm.scss';

class LoginForm extends Component {
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
                                onTouchTap={this.submitForm}
                                className='submitBtn'
                                label='submit'
                                primary={true} />
                        </div>
                    </form>
                </CardText>
            </Card>
        );
    }
}

export default (reduxForm({
    form: 'login'
})(LoginForm));
