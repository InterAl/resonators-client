import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
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
      <Router history={browserHistory}>
          <Route path="/" component={Layout}>
              <Route path="resetPassword" component={ResetPasword} />
              <Route path="*/criteria/submit" component={ResonatorFeedback} />
              <Route path="followers" component={Followers} />
              <Route path="followers/:followerId/resonators/new" component={EditResonator} />
              <Route path="followers/:followerId/resonators/:resonatorId/show" component={ShowResonator}/>
              <Route path="followers/:followerId/resonators/:resonatorId/edit" component={EditResonator} />
              <Route path="followers/:followerId/resonators" component={FollowerResonators}/>
              <Route path="followers/:followerId/resonators/:resonatorId/stats/:qid" component={ResonatorStats}/>
              <Route path="clinics" component={Clinics}/>
              <Route path="clinics/criteria/new" component={CriteriaCreation}/>
              <Route path="clinics/criteria/:criterionId/edit" component={CriteriaCreation}/>
              <Route path="clinics/criteria" component={CriteriaList}/>
              <Route path="login" component={Visitor} />
              <Route path="/*" component={NoMatch} />
          </Route>
      </Router>
    );
  }
}

export default AppComponent;
