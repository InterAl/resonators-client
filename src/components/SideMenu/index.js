import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions } from '../../actions/menuActions';
import navigationInfoSelector from '../../selectors/navigationSelector';
import AppBar from './AppBar';
import isMobile from '../isMobile';
import './index.scss';
import { Divider, List, ListItem, ListItemText, ListItemIcon, Drawer, Collapse } from '@material-ui/core';
import { DirectionsWalk, Weekend, EventNote, List as ListIcon, ExitToApp, ExpandLess, ExpandMore } from '@material-ui/icons';


class SideMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clinicMenuOpen: true
        }
    }

    render() {
        return (
            <Drawer
                open={this.props.navigationInfo.menuOpen}
                containerStyle={{ marginTop: isMobile() ? 0 : 66 }}>
                <div>
                    {isMobile() &&
                        <AppBar onClose={this.props.toggleMenu} />}

                    <List>
                        <ListItem button onClick={() => this.props.clickMenuItem('followers')}>
                            <ListItemIcon><DirectionsWalk /></ListItemIcon>
                            <ListItemText primary="Followers" />
                        </ListItem>
                        <ListItem button onClick={() => this.setState({clinicMenuOpen: !this.state.clinicMenuOpen})}>
                            <ListItemIcon><Weekend /></ListItemIcon>
                            <ListItemText primary="Clinic" />
                            {this.state.clinicMenuOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={this.state.clinicMenuOpen}>
                            <List style={{marginLeft: 20}}>
                                <ListItem onClick={() => this.props.clickMenuItem('clinics')}>
                                    <ListItemIcon><ListIcon /></ListItemIcon>
                                    <ListItemText primary="Clinics List" />
                                </ListItem>
                                <ListItem onClick={() => this.props.clickMenuItem('criteriaList')}>
                                    <ListItemIcon><EventNote /></ListItemIcon>
                                    <ListItemText primary="Criteria List" />
                                </ListItem>
                            </List>
                        </Collapse>
                        <Divider style={{ marginTop: 12, marginBottom: 12 }} />
                        <ListItem onClick={() => this.props.clickMenuItem('logout')} style={{ color: '#ff4444' }}>
                            <ListItemIcon><ExitToApp color='#ff4444' /></ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </List>
                </div>
            </Drawer>
        );
    }
}

export default connect(
    state => ({
        navigationInfo: navigationInfoSelector(state)
    }),
    dispatch => bindActionCreators({
        toggleMenu: actions.toggleMenu,
        clickMenuItem: actions.clickMenuItem
    }, dispatch))(SideMenu);
