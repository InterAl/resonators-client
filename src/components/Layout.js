import React from "react";
import { connect } from "react-redux";
import { Toolbar, Grid } from "@material-ui/core";

import TopBar from "./TopBar";
import SideMenu from "./SideMenu";
import loginInfoSelector from "../selectors/loginInfo";

const Layout = (props) => (
    <>
        <TopBar />
        <Toolbar />
        <Grid container wrap="nowrap">
            {props.loggedIn ? (
                <Grid item>
                    <SideMenu />
                </Grid>
            ) : null}
            <Grid item xs container justify="center" style={{ padding: 30 }}>
                <Grid item xs md={10} xl={8}>
                    {props.children}
                </Grid>
            </Grid>
        </Grid>
    </>
);

const mapStateToProps = (state) => ({
    loggedIn: loginInfoSelector(state).loggedIn,
});

export default connect(mapStateToProps, null)(Layout);
