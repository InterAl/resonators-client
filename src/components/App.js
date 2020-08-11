import React from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router";
import { ConnectedRouter } from "connected-react-router";

import history from "../stores/history";

import Layout from "./Layout";
import Clinics from "./Clinics";
import NoMatch from "./NoMatch";
import HomePage from "./HomePage";
import Followers from "./Followers";
import LoginPage from "./LoginPage";
import CriteriaList from "./CriteriaList";
import ShowResonator from "./ShowResonator";
import EditResonator from "./EditResonator";
import ResetPassword from "./ResetPassword";
import ResonatorStats from "./ResonatorStats";
import ResonatorFeedback from "./ResonatorFeedback";
import SentResonator from "./followers/SentResonator";
import FollowerResonators from "./FollowerResonators";
import CriteriaCreation from "./CriteriaCreation/index";
import ResonatorsOverview from "./followers/ResonatorsOverview";

const LeaderRoutes = () => (
    <>
        <Route exact path="/followers" component={Followers} />
        <Route path="/followers/:followerId" component={FollowerResonators} />
        <Route path="/followers/:followerId/resonators/:resonatorId" component={ShowResonator} />
        <Route exact path="/followers/:followerId/resonators/new" component={EditResonator} />
        <Route exact path="/followers/:followerId/resonators/:resonatorId/edit" component={EditResonator} />
        <Route exact path="/followers/:followerId/resonators/:resonatorId/stats/:qid" component={ResonatorStats} />

        <Route exact path="/clinics" component={Clinics} />
        <Route exact path="/clinics/criteria" component={CriteriaList} />
        <Route exact path="*/criteria/submit" component={ResonatorFeedback} />
        <Route exact path="/clinics/criteria/new" component={CriteriaCreation} />
        <Route path="/clinics/criteria/:criterionId" component={CriteriaCreation} />
    </>
);

const FollowerRoutes = () => (
    <>
        <Route exact path="/follower/resonators" component={ResonatorsOverview} />
        <Route exact path="/follower/resonators/:sentResonatorId" component={SentResonator} />
    </>
);

const App = (props) => (
    <ConnectedRouter history={history}>
        <Switch>
            <Route path="/(.+)">
                <Layout>
                    <Switch>
                        {props.user ? (
                            <>
                                {props.user.isLeader ? <LeaderRoutes /> : null}
                                {props.user.isFollower ? <FollowerRoutes /> : null}
                            </>
                        ) : null}

                        <Route exact path="/login" component={LoginPage} />
                        <Route exact path="/resetPassword" component={ResetPassword} />

                        <Route component={NoMatch} />
                    </Switch>
                </Layout>
            </Route>
            <Route exact path="/" component={HomePage} />
        </Switch>
    </ConnectedRouter>
);

const mapStateToProps = (state) => ({
    user: state.session.user,
});

export default connect(mapStateToProps, null)(App);
