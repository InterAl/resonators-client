import React, {Component} from 'react';
import Drawer from 'material-ui/Drawer';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions} from '../../actions/menuActions';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FollowerIcon from 'material-ui/svg-icons/maps/directions-walk';
import ClinicIcon from 'material-ui/svg-icons/content/weekend';
import CriteriaIcon from 'material-ui/svg-icons/notification/event-note';
import ListIcon from 'material-ui/svg-icons/action/list';
import LogoutIcon from 'material-ui/svg-icons/action/exit-to-app';
import navigationInfoSelector from '../../selectors/navigationSelector';
import AppBar from './AppBar';
import isMobile from '../isMobile';
import classNames from 'classnames';
import './index.scss';

class SideMenu extends Component {
    render() {
        return (
            <Drawer
                open={this.props.navigationInfo.menuOpen}
                containerStyle={{marginTop: isMobile() ? 0 : 66}}
            >
                <div>
                    {isMobile() &&
                    <AppBar onClose={this.props.toggleMenu}/>}

                    <List>
                        <ListItem onTouchTap={() => this.props.clickMenuItem('followers')}
                                  primaryText='Followers'
                                  leftIcon={<FollowerIcon/>} />
                        <ListItem
                                  primaryText='Clinic'
                                  leftIcon={<ClinicIcon/>}
                                  primaryTogglesNestedList={true}
                                  nestedItems={[
                                      <ListItem
                                          onTouchTap={() => this.props.clickMenuItem('clinics')}
                                          primaryText='Clinics List'
                                          leftIcon={<ListIcon/>}/>,
                                      <ListItem
                                          onTouchTap={() => this.props.clickMenuItem('criteriaList')}
                                          primaryText='Criteria List'
                                          leftIcon={<CriteriaIcon/>}/>
                                  ]}
                        />
                        <Divider style={{marginTop: 12, marginBottom: 12}}/>
                        <ListItem onTouchTap={() => this.props.clickMenuItem('logout')}
                                  primaryText='Logout'
                                  style={{color: '#ff4444'}}
                                  leftIcon={<LogoutIcon color='#ff4444'/>}/>
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
