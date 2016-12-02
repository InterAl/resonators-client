import React from 'react';
import YeomanImage from './YeomanImage';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import './app.css';

class AppComponent extends React.Component {

  render() {
    return (
      <MuiThemeProvider>
          <div>
              <AppBar title="Resonators" />
              <Drawer open={true} />
              <RaisedButton label="aaa" />
          </div>
      </MuiThemeProvider>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
