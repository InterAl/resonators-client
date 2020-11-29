import { connect } from "react-redux";
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { Field, reduxForm } from "redux-form";
import { Card, CardHeader, CardContent, Button, Typography } from "@material-ui/core";

import "./LoginForm.scss";
import googleIcon from "../Icons/GoogleIcon";
import TextField from "../FormComponents/TextField";
import { actions as sessionActions } from "../../actions/sessionActions";
import { actions as navigationActions } from "../../actions/navigationActions";

const isLoginFormRequired = true;

class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLeader: props.isLeaderPage
        };

        this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
        this.switchLoginMode = this.switchLoginMode.bind(this);
    }

    handleGoogleLogin() {
        this.props.googleLogin({isLeader: this.state.isLeader});
    }

    switchLoginMode() {
        this.setState({ isLeader: !this.state.isLeader });
    }

    render() {
        const role = (this.state.isLeader) ? "leader" : "follower";
        let google_error_message = '';
        switch(this.props.errorGoogle) { // this should probably be replaced by key-based translations later
            case 'not_leader':
                google_error_message = 'This user is not registered as a Leader.';
            break;
            case 'not_follower':
                google_error_message = 'System cannot find a Follower record for this user. Please contact your Leader.';
                break;
            case 'follower_registration_not_allowed':
                google_error_message = 'Can\'t register as a follower. Please contact your Leader.';
            break;
            case 'unknown':
                google_error_message = 'Unknown problem. Try again';
            break;
        }

        return (
            <Card className="login-form" elevation={10}>
                <CardHeader title="Welcome!" subheader={"Sign in to use the Resonators app as a " + role} />
                <CardContent>
                    {!isLoginFormRequired && (
                        <Typography paragraph>
                            Registration to the Resonators app is currently possible via a Google account only
                        </Typography>
                    )}
                    <Button
                        fullWidth
                        type="button"
                        variant="outlined"
                        startIcon={googleIcon}
                        onClick={this.handleGoogleLogin}
                    >
                        Continue with Google
                    </Button>
                    {google_error_message && <div className="error" style={{ color: "red", textAlign: "center"}}>{google_error_message}</div>}
                </CardContent>
                {isLoginFormRequired && (
                    <CardContent>
                        <Typography paragraph align="center" variant="subtitle2">OR</Typography>
                        <form onSubmit={this.props.handleSubmit}>
                            <Field type="email" name="email" component={TextField} props={{ placeholder: "Email" }} />
                            <br />
                            <Field
                                type="password"
                                name="password"
                                component={TextField}
                                props={{ placeholder: "Password" }}
                            />
                            {this.props.submitFailed && "Login failed"}
                            <Button
                                type="submit"
                                className="submitBtn"
                                color="primary"
                                variant="contained"
                                style={{ marginTop: 30, marginBottom: 10 }}
                                onClick={() => {this.props.change('isLeader', this.state.isLeader)}}
                            >
                                submit
                            </Button>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Button
                                    type="button"
                                    onClick={() => this.props.showRegistrationModal(this.state.isLeader)}
                                    className="registerBtn"
                                >
                                    Register
                                </Button>
                                <Button
                                    type="button"
                                    onClick={this.props.showForgotPasswordModal}
                                    className="registerBtn"
                                >
                                    Forgot password?
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                )}
                {(this.props.isLeaderPage ||
                    (window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone) || document.referrer.includes('android-app://')
                ) && ( // Show the switch in Leader mode or in standalone PWA app
                    <CardContent>
                        <span className="leader-switch_mode">Click <Button onClick={this.switchLoginMode}>HERE</Button> to sign in as a {(!this.state.isLeader) ? "leader" : "follower"}</span>
                    </CardContent>
                )}
            </Card>
        );
    }
}

function mapStateToProps(state) {
    return {
        errorGoogle: state.router.location.query.error
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            showRegistrationModal: (isLeader) =>
                navigationActions.showModal({
                    name: "registration",
                    props: {
                        isLeader: isLeader
                    }
                }),

            showForgotPasswordModal: () =>
                navigationActions.showModal({
                    name: "forgotPassword",
                }),

            googleLogin: sessionActions.googleLogin
        },
        dispatch
    );
}


export default connect(mapStateToProps, mapDispatchToProps)(
    reduxForm({
        form: "login",
    })(LoginForm)
);
