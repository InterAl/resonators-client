import React, { Component } from "react";
import { connect } from "react-redux";
import { ThemeProvider, Toolbar, Grid } from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import SideMenu from "./SideMenu";
import TopBar from "./TopBar";
import ModalDisplayer from "./ModalDisplayer";
import loginInfoSelector from "../selectors/loginInfo";
import navigationSelector from "../selectors/navigationSelector";
import { withRouter } from "react-router";
import theme from "./theme";
import "./app.scss";

class Layout extends Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
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
            </ThemeProvider>
        );
    }
}

const mapStateToProps = (state) => ({
    modal: navigationSelector(state).modal,
    loggedIn: loginInfoSelector(state).loggedIn,
});

export default withRouter(connect(mapStateToProps, null)(Layout));
