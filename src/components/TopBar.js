import React from "react";
import { connect } from "react-redux";
import { Menu } from "@material-ui/icons";
import { bindActionCreators } from "redux";
import { AppBar, Toolbar, IconButton, Hidden } from "@material-ui/core";

import HeaderLogo from "./HeaderLogo";
import Breadcrumbs from "./Breadcrumbs";
import { actions } from "../actions/menuActions";
import loginInfoSelector from "../selectors/loginInfo";

function TopBar(props) {
    return (
        <AppBar>
            <Toolbar>
                {props.loggedIn ? (
                    <Hidden mdUp>
                        <IconButton onClick={props.toggleMenu} color="inherit" edge="start">
                            <Menu />
                        </IconButton>
                    </Hidden>
                ) : null}
                <Breadcrumbs />
                <Hidden xsDown>
                    <HeaderLogo />
                </Hidden>
            </Toolbar>
        </AppBar>
    );
}

export default connect(
    (state) => ({ loggedIn: loginInfoSelector(state).loggedIn }),
    (dispatch) => bindActionCreators({ toggleMenu: actions.toggleMenu }, dispatch)
)(TopBar);
