import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import { Router, Route, browserHistory } from 'react-router';
import Followers from './Followers';
import NoMatch from './NoMatch';
import Visitor from './Visitor';
import './app.css';
import '../static/bootstrap/css/bootstrap.min.css';

const {PropTypes} = React;

const routes = (
    <Route path="/">
        <Route path="react" component={Visitor} />
        <Route path="react/followers" component={Followers} />
        <Route path="/*" component={NoMatch} />
    </Route>       
);

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
                title="Resonators" />
              <Drawer open={false} />
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
