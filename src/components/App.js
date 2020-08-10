import React from 'react';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import history from '../stores/history';
import Layout from './Layout';
import Followers from './Followers';
import FollowerGroups from './FollowerGroups';
import Clinics from './Clinics';
import NoMatch from './NoMatch';
import LoginPage from './LoginPage';
import FollowerResonators from './FollowerResonators';
import FollowerGroupResonators from './FollowerGroupResonators';
import FollowerGroupMembers from './FollowerGroupMembers';
import EditResonator from './EditResonator';
import ShowResonator from './ShowResonator';
import ResonatorStats from './ResonatorStats';
import CriteriaList from './CriteriaList';
import CriteriaCreation from './CriteriaCreation/index';
import ResetPassword from './ResetPassword';
import ResonatorFeedback from './ResonatorFeedback';
import HomePage from './HomePage';
import ResonatorsOverview from './followers/ResonatorsOverview';


class AppComponent extends React.Component {
  render() {
    return (
      <ConnectedRouter history={history}>
        <Switch>
          <Route path='/(.+)'>
            <Layout>
              <Switch>
                <Route exact path="/followers/:followerId/resonators/new" component={EditResonator} />
                <Route exact path="/followers/:followerId/resonators/:resonatorId/edit" component={EditResonator} />
                <Route exact path="/followers/:followerId/resonators/:resonatorId/stats/:qid" component={ResonatorStats} />
                <Route path="/followers/:followerId/resonators/:resonatorId" component={ShowResonator} />
                <Route path="/followers/:followerId" component={FollowerResonators} />
                <Route exact path="/followers" component={Followers} />
                
                <Route exact path="/followerGroups/:followerGroupId/resonators/new" component={EditResonator}/>
                <Route exact path="/followerGroups/:followerGroupId/resonators/:resonatorId/edit" component={EditResonator}/>
                <Route exact path="/followerGroups/:followerGroupId/resonators/:resonatorId/stats/:qid" component={ResonatorStats}/>
                <Route path="/followerGroups/:followerGroupId/resonators/:resonatorId" component={ShowResonator}/>
                <Route path="/followerGroups/:followerGroupId/members" component={FollowerGroupMembers}/>
                <Route path="/followerGroups/:followerGroupId" component={FollowerGroupResonators}/>
                <Route exact path="/followerGroups" component={FollowerGroups}/>

                <Route exact path="/resetPassword" component={ResetPassword} />
                <Route exact path="*/criteria/submit" component={ResonatorFeedback} />
                <Route exact path="/clinics" component={Clinics} />
                <Route exact path="/clinics/criteria/new" component={CriteriaCreation} />
                <Route path="/clinics/criteria/:criterionId" component={CriteriaCreation} />
                <Route exact path="/clinics/criteria" component={CriteriaList} />

                <Route exact path="/follower/resonators" component={ResonatorsOverview} />

                <Route exact path="/login" component={LoginPage} />
                <Route component={NoMatch} />
              </Switch>
            </Layout>
          </Route>
          <Route exact path='/' component={HomePage} />
        </Switch>
      </ConnectedRouter>
    );
  }
}

export default AppComponent;
