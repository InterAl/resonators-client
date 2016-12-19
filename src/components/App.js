import _ from 'lodash';
import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import Layout from './Layout';
import '../static/bootstrap/css/bootstrap.min.css';
import Followers from './Followers';
import NoMatch from './NoMatch';
import Visitor from './Visitor';
import FollowerResonators from './FollowerResonators';
import EditResonator from './EditResonator';
import ShowResonator from './ShowResonator';

const {PropTypes} = React;

class AppComponent extends React.Component {
  static propTypes = {
      loginInfo: PropTypes.object.isRequired,
      navigationInfo: PropTypes.object.isRequired,
  };

  render() {
    return (
      <Router history={browserHistory}>
          <Route path="/" component={Layout}>
              <Route path="react" component={Visitor} />
              <Route path="react/followers" component={Followers} />
              <Route path="react/followers/:followerId/resonators/new" component={EditResonator} />
              <Route path="react/followers/:followerId/resonators/:resonatorId/show" component={ShowResonator}/>
              <Route path="react/followers/:followerId/resonators/:resonatorId/edit" component={EditResonator} />
              <Route path="react/followers/:followerId/resonators" component={FollowerResonators}/>
              <Route path="/*" component={NoMatch} />
          </Route>
      </Router>
    );
  }
}

export default AppComponent;
