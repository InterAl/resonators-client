import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Button from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { Field, reduxForm } from 'redux-form';
import './LoginForm.scss';

class LoginForm extends Component {
    renderTextField({ input, label, meta: { touched, error }, ...custom }) {
        return (
            <TextField hintText={label}
              fullWidth={true}
              floatingLabelText={label}
              errorText={touched && error}
              {...input}
              {...custom}
            />
        );
    }

    render() {
        return (
            <Card className='loginForm col-sm-3'>
                <CardHeader title="Login" />
                <CardText className='cardText'>
                    <form onSubmit={this.props.handleSubmit}>
                        <Field type='email' name='email' component={this.renderTextField}
                               props={{ placeholder: 'Email' }}
                        />
                        <br/>
                        <Field type='password' name='password' component={this.renderTextField}
                               props={{ placeholder: 'Password' }}
                        />
                        {this.props.submitFailed && "Login failed"}
                        <div className='submitBtnWrapper'>
                            <Button
                                type="submit"
                                onClick={this.submitForm}
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
