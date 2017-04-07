import React from 'react';
import { Route, Redirect, Switch } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
import history from '../stores/history';
import Layout from './Layout';
import '../static/bootstrap/css/bootstrap.min.css';
import Followers from './Followers';
import Clinics from './Clinics';
import NoMatch from './NoMatch';
import Visitor from './Visitor';
import FollowerResonators from './FollowerResonators';
import EditResonator from './EditResonator';
import ShowResonator from './ShowResonator';
import ResonatorStats from './ResonatorStats';
import CriteriaList from './CriteriaList';
import CriteriaCreation from './CriteriaCreation/index';
import ResetPasword from './ResetPassword';
import ResonatorFeedback from './ResonatorFeedback';

const {PropTypes} = React;

class AppComponent extends React.Component {
  static propTypes = {
      loginInfo: PropTypes.object.isRequired,
      navigationInfo: PropTypes.object.isRequired,
  };

  render() {
      return (
          <ConnectedRouter history={history}>
              <Route path='/'>
                  <Layout>
                      <Switch>
                          <Route exact path="/followers/:followerId/resonators/new" component={EditResonator} />
                          <Route exact path="/followers/:followerId/resonators/:resonatorId/edit" component={EditResonator} />
                          <Route exact path="/followers/:followerId/resonators/:resonatorId/stats/:qid" component={ResonatorStats}/>
                          <Route path="/followers/:followerId/resonators/:resonatorId" component={ShowResonator}/>
                          <Route path="/followers/:followerId" component={FollowerResonators}/>
                          <Route exact path="/followers" component={Followers} />

                          <Route exact path="/resetPassword" component={ResetPasword} />
                          <Route exact path="*/criteria/submit" component={ResonatorFeedback} />
                          <Route exact path="/clinics" component={Clinics}/>
                          <Route exact path="/clinics/criteria/new" component={CriteriaCreation}/>
                          <Route path="/clinics/criteria/:criterionId" component={CriteriaCreation}/>
                          <Route exact path="/clinics/criteria" component={CriteriaList}/>
                          <Route exact path="/login" component={Visitor} />
                          <Route component={NoMatch} />
                      </Switch>
                  </Layout>
              </Route>
          </ConnectedRouter>
      );
  }
}

export default AppComponent;
