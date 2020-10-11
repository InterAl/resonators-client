import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Grid, makeStyles } from "@material-ui/core";

import LoginForm from "./LoginForm";
import { actions } from "../../actions/sessionActions";

const useStyles = makeStyles(() => ({
    container: {
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
}));

const LoginPage = (props) => {
    return (
        <Grid container justify="center" alignItems="center" className={useStyles().container}>
            <Grid item xs={10} sm={8} md={6} lg={5} xl={4}>
                <LoginForm onSubmit={props.login} />
            </Grid>
        </Grid>
    );
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ login: actions.login }, dispatch);
}

export default connect(null, mapDispatchToProps)(LoginPage);
