import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import SideMenu from './SideMenu';
import Hamburger from 'material-ui/svg-icons/navigation/menu';
import ModalDisplayer from './ModalDisplayer';
import loginInfoSelector from '../selectors/loginInfo';
import navigationSelector from '../selectors/navigationSelector';
import {actions as menuActions} from '../actions/menuActions';
import './app.css';

let Layout = props => {
    return (
        <MuiThemeProvider>
            <div className='mainContainer'>
                <AppBar
                  showMenuIconButton={props.navigationInfo.showHamburger}
                  iconElementLeft={
                      <IconButton onClick={props.toggleMenu}>
                          <Hamburger />
                      </IconButton>
                  }
                  title={props.navigationInfo.title}/>
                <SideMenu />
                <div className='screenWrapper'>
                    {props.children}
                    <ModalDisplayer modal={props.navigationInfo.modal} />
                </div>
            </div>
        </MuiThemeProvider>
    );
}

export default connect(state => ({
    navigationInfo: navigationSelector(state)
}), dispatch => bindActionCreators({
    toggleMenu: menuActions.toggleMenu
}, dispatch))(Layout);
