import React, {Component} from 'react';
import {actions} from '../actions/sessionActions';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import TextBox from './FormComponents/TextBox';
import CircularProgress from 'material-ui/CircularProgress';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

class ResetPassword extends Component {
    static propTypes = {

    };

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(form) {
        this.props.resetPassword(form.password);
    }

    render() {
        return (
            <div className='row' style={{'display': 'flex', width: '100%', marginTop: 30}}>
                <div className='center-block'>
                    <Card>
                        <CardHeader
                            title='Reset password'
                            subtitle='Please enter your new password below'
                        />
                        <CardText>
                            <TextBox name='password' type='password'/>

                            <RaisedButton
                                label='Submit'
                                primary
                                onClick={this.props.handleSubmit(this.handleSubmit)}
                                style={{marginTop: 30, marginBottom: 30}}
                            />

                            <br/>

                            {this.props.showSpinner &&
                            <CircularProgress size={30} thickness={3}/>}

                            {this.props.success && (
                                <div>
                                    Your password has been successfully reset.<br/>
                                    You will be redirected to the login page shortly.
                                </div>
                            )}
                        </CardText>
                    </Card>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        resetPassword: actions.resetPassword
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        success: state.session.resetPasswordSuccessful,
        showSpinner: state.session.resetPasswordSpinner
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'resetPassword',
    validate(form) {
        let errors = {};

        if (!form.password)
            errors.password = 'Required';

        return errors;
    }
})(ResetPassword));
