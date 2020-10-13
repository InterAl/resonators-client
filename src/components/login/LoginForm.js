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

const isLoginFormRequired = false;

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
            <Card className="login-form" elevation={10}>
                <CardHeader title="Welcome!" subheader="Sign in to use the Resonators app" />
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
                                    onClick={this.props.showRegistrationModal}
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
            </Card>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            showRegistrationModal: () =>
                navigationActions.showModal({
                    name: "registration",
                }),

            showForgotPasswordModal: () =>
                navigationActions.showModal({
                    name: "forgotPassword",
                }),

            googleLogin: sessionActions.googleLogin,
        },
        dispatch
    );
}

export default connect(
    null,
    mapDispatchToProps
)(
    reduxForm({
        form: "login",
    })(LoginForm)
);
