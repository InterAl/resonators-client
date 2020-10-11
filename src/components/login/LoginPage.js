import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import LoginForm from "./LoginForm";
import Layout from "../layouts/EmptyCenteredLayout";
import { actions } from "../../actions/sessionActions";

const LoginPage = (props) => {
    return (
        <Layout>
            <LoginForm onSubmit={props.login} />
        </Layout>
    );
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ login: actions.login }, dispatch);
}

export default connect(null, mapDispatchToProps)(LoginPage);
