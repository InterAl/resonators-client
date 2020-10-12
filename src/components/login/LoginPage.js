import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { makeStyles } from "@material-ui/core";

import LoginForm from "./LoginForm";
import Layout from "../layouts/EmptyCenteredLayout";
import { actions } from "../../actions/sessionActions";

const useStyles = makeStyles((theme) => ({
    page: {
        backgroundImage: `linear-gradient(${theme.palette.primary.light}, 90%, ${theme.palette.primary.dark})`
    },
}));

const LoginPage = (props) => {
    const classes = useStyles();

    return (
        <Layout className={classes.page}>
            <LoginForm onSubmit={props.login} />
        </Layout>
    );
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ login: actions.login }, dispatch);
}

export default connect(null, mapDispatchToProps)(LoginPage);
