import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as followersActions } from "../actions/followersActions";
import { ThemeProvider, AppBar, Toolbar, IconButton } from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { Menu } from "@material-ui/icons";
import SideMenu from "./SideMenu";
import ModalDisplayer from "./ModalDisplayer";
import navigationSelector from "../selectors/navigationSelector";
import { actions as menuActions } from "../actions/menuActions";
import { withRouter } from "react-router";
import HeaderLogo from "./HeaderLogo";
import renderBreadcrumbs from "./breadcrumbs";
import classNames from "classnames";
import theme from "./theme";
import "./app.scss";

class Layout extends Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <div className="main-container">
                        <AppBar>
                            <Toolbar>
                                {this.props.navigationInfo.showHamburger ? (
                                    <IconButton onClick={this.props.toggleMenu} color="inherit" edge="start">
                                        <Menu />
                                    </IconButton>
                                ) : null}
                                {this.props.breadcrumbs}
                                <HeaderLogo />
                            </Toolbar>
                        </AppBar>
                        <SideMenu />
                        <div
                            className={classNames("screenWrapper", {
                                menuClosed: !this.props.navigationInfo.menuOpen,
                            })}
                        >
                            <Toolbar /> {/* placeholder to keep the main content below the app bar */}
                            {this.props.children}
                            <ModalDisplayer modal={this.props.navigationInfo.modal} />
                        </div>
                    </div>
                </MuiPickersUtilsProvider>
            </ThemeProvider>
        );
    }
}

export default withRouter(
    connect(
        (state) => ({
            navigationInfo: navigationSelector(state),
            breadcrumbs: renderBreadcrumbs(state),
        }),
        (dispatch) =>
            bindActionCreators(
                {
                    toggleMenu: menuActions.toggleMenu,
                    fetchFollowerResonators: followersActions.fetchFollowerResonators,
                },
                dispatch
            )
    )(Layout)
);
