import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import { Router, browserHistory } from 'react-router';
import SideMenu from './SideMenu';
import routes from './Routes';
import IconButton from 'material-ui/IconButton';
import Hamburger from 'material-ui/svg-icons/navigation/menu';
import './app.css';
import '../static/bootstrap/css/bootstrap.min.css';

const {PropTypes} = React;

class AppComponent extends React.Component {
  static propTypes = {
      loginInfo: PropTypes.object.isRequired,
      navigationInfo: PropTypes.object.isRequired,
  };

  render() {
    return (
      <MuiThemeProvider>
          <div className='mainContainer'>
              <AppBar
                showMenuIconButton={this.props.navigationInfo.showHamburger}
                onLeftIconButtonTouchTap={() => console.log('ggg')}
                iconElementLeft={
                    <IconButton onClick={this.props.toggleMenu}>
                        <Hamburger />
                    </IconButton>
                }
                title="Resonators" />
              <SideMenu />
              <div className='screenWrapper'>
                  <Router history={browserHistory}>
                    {routes}
                  </Router>
              </div>
          </div>
      </MuiThemeProvider>
    );
  }
}

export default AppComponent;
