import { connect } from "react-redux";
import React, { Component } from "react";
import MomentUtils from "@date-io/moment";
import { withRouter } from "react-router";
import { SnackbarProvider } from "notistack";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { ThemeProvider, Toolbar, Grid } from "@material-ui/core";

import "./app.scss";
import theme from "./theme";
import TopBar from "./TopBar";
import SideMenu from "./SideMenu";
import ModalDisplayer from "./ModalDisplayer";
import loginInfoSelector from "../selectors/loginInfo";
import navigationSelector from "../selectors/navigationSelector";

class Layout extends Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                <SnackbarProvider>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <TopBar />
                        <Toolbar />
                        <Grid container wrap="nowrap">
                            {this.props.loggedIn ? (
                                <Grid item>
                                    <SideMenu />
                                </Grid>
                            ) : null}
                            <Grid item xs container justify="center" style={{ padding: 30 }}>
                                <Grid item xs md={10} xl={8}>
                                    {this.props.children}
                                </Grid>
                            </Grid>
                        </Grid>
                        <ModalDisplayer modal={this.props.modal} />
                    </MuiPickersUtilsProvider>
                </SnackbarProvider>
            </ThemeProvider>
        );
    }
}

const mapStateToProps = (state) => ({
    modal: navigationSelector(state).modal,
    loggedIn: loginInfoSelector(state).loggedIn,
});

export default withRouter(connect(mapStateToProps, null)(Layout));
