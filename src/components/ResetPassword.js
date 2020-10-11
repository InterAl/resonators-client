import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { CircularProgress, Button, Card, CardHeader, CardContent, CardActions, Typography } from "@material-ui/core";

import TextBox from "./FormComponents/TextBox";
import Layout from "./layouts/EmptyCenteredLayout";
import { actions } from "../actions/sessionActions";

class ResetPassword extends Component {
    static propTypes = {};

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(form) {
        this.props.resetPassword(form.password);
    }

    render() {
        return (
            <Layout>
                <Card>
                    <CardHeader title="Reset password" subheader="Please enter your new password below" />
                    <CardContent>
                        <TextBox name="password" type="password" label="Password" />
                    </CardContent>
                    <CardActions>
                        <Button
                            color="primary"
                            variant="contained"
                            disabled={this.props.invalid}
                            onClick={this.props.handleSubmit(this.handleSubmit)}
                        >
                            Submit
                        </Button>
                        {this.props.showSpinner && <CircularProgress size={30} thickness={3} />}
                        {this.props.success && (
                            <Typography>
                                Your password has been successfully reset.
                                <br />
                                You will be redirected to the login page shortly.
                            </Typography>
                        )}
                    </CardActions>
                </Card>
            </Layout>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            resetPassword: actions.resetPassword,
        },
        dispatch
    );
}

function mapStateToProps(state) {
    return {
        success: state.session.resetPasswordSuccessful,
        showSpinner: state.session.resetPasswordSpinner,
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    reduxForm({
        form: "resetPassword",
        validate(form) {
            let errors = {};

            if (!form.password) errors.password = "Required";

            return errors;
        },
    })(ResetPassword)
);
