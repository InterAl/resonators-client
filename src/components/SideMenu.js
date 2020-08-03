import React, { useState } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions } from "../actions/menuActions";
import navigationSelector from "../selectors/navigationSelector";

import {
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Drawer,
    Collapse,
    Toolbar,
    makeStyles,
    useTheme,
    useMediaQuery,
} from "@material-ui/core";
import {
    DirectionsWalk,
    Weekend,
    EventNote,
    List as ListIcon,
    ExitToApp,
    ExpandLess,
    ExpandMore,
} from "@material-ui/icons";

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
    drawer: {
        minWidth: drawerWidth,
        zIndex: theme.zIndex.appBar - 1,
        padding: theme.spacing(1),
    },
    drawerPaper: {
        minWidth: drawerWidth,
        padding: theme.spacing(1),
    },
}));

function SideMenu(props) {
    const screenSmall = useMediaQuery(useTheme().breakpoints.down("sm"));
    const classes = useStyles(props);

    const [clinicMenuOpen, setClinicMenuOpen] = useState(true);

    return (
        <Drawer
            open={props.menuOpen}
            variant={screenSmall ? "temporary" : "permanent"}
            classes={{ root: classes.drawer, paper: classes.drawerPaper }}
            PaperProps={{ elevation: 4 }}
            onClose={props.toggleMenu}
        >
            {screenSmall ? null : (
                /* a placeholder to keep the content below the app bar.
                   The drawer must have a separate toolbar placeholder because it has position: fixed.
                   Not required on "mobile" cause then we use the temporary drawer style. */
                <Toolbar />
            )}
            <List>
                <ListItem button onClick={() => props.clickMenuItem("followers")}>
                    <ListItemIcon>
                        <DirectionsWalk />
                    </ListItemIcon>
                    <ListItemText primary="Followers" />
                </ListItem>
                <ListItem button onClick={() => setClinicMenuOpen(!clinicMenuOpen)}>
                    <ListItemIcon>
                        <Weekend />
                    </ListItemIcon>
                    <ListItemText primary="Clinic" />
                    {clinicMenuOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={clinicMenuOpen}>
                    <List style={{ marginLeft: 20 }}>
                        <ListItem button onClick={() => props.clickMenuItem("clinics")}>
                            <ListItemIcon>
                                <ListIcon />
                            </ListItemIcon>
                            <ListItemText primary="Clinics List" />
                        </ListItem>
                        <ListItem button onClick={() => props.clickMenuItem("criteriaList")}>
                            <ListItemIcon>
                                <EventNote />
                            </ListItemIcon>
                            <ListItemText primary="Criteria List" />
                        </ListItem>
                    </List>
                </Collapse>
                <Divider />
                <List>
                    <ListItem button onClick={() => props.clickMenuItem("logout")} style={{ color: "#ff4444" }}>
                        <ListItemIcon>
                            <ExitToApp htmlColor="#ff4444" />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </List>
        </Drawer>
    );
}

export default connect(
    (state) => ({ menuOpen: navigationSelector(state).menuOpen }),
    (dispatch) =>
        bindActionCreators(
            {
                toggleMenu: actions.toggleMenu,
                clickMenuItem: actions.clickMenuItem,
            },
            dispatch
        )
)(SideMenu);
