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
import FollowerGroups from "./FollowerGroups";
import ResonatorFeedback from "./ResonatorFeedback";
import FollowerResonators from "./FollowerResonators";
import CriteriaCreation from "./CriteriaCreation/index";
import FollowerGroupMembers from "./FollowerGroupMembers";
import ResonatorsOverview from "./followers/ResonatorsOverview";
import FollowerGroupResonators from "./FollowerGroupResonators";

const leaderRoutes = [
    { path: "/followers", component: Followers },
    { path: "/followers/:followerId/resonators", component: FollowerResonators },
    { path: "/followers/:followerId/resonators/new", component: EditResonator },
    { path: "/followers/:followerId/resonators/:resonatorId/show", component: ShowResonator },
    { path: "/followers/:followerId/resonators/:resonatorId/edit", component: EditResonator },
    { path: "/followers/:followerId/resonators/:resonatorId/stats/:qid", component: ResonatorStats },

    { path: "/clinics", component: Clinics },
    { path: "/clinics/criteria", component: CriteriaList },
    { path: "/clinics/criteria/new", component: CriteriaCreation },
    { path: "/clinics/criteria/:criterionId/edit", component: CriteriaCreation },
];

const leaderGroupRoutes = [
    { path: "/followerGroups", component: FollowerGroups },
    { path: "/followerGroups/:followerGroupId/resonators", component: FollowerGroupResonators },
    { path: "/followerGroups/:followerGroupId/resonators/new", component: EditResonator },
    { path: "/followerGroups/:followerGroupId/resonators/:resonatorId/show", component: ShowResonator },
    { path: "/followerGroups/:followerGroupId/resonators/:resonatorId/edit", component: EditResonator },
    { path: "/followerGroups/:followerGroupId/resonators/:resonatorId/stats/:qid", component: ResonatorStats },
    { path: "/followerGroups/:followerGroupId/members", component: FollowerGroupMembers },
];

const followerRoutes = [{ path: "/follower/resonators/:sentResonatorId?", component: ResonatorsOverview }];

const noLayoutRoutes = [
    { path: "/login", component: LoginPage },
    { path: "/resetPassword", component: ResetPassword },
    { path: "/stats/reminders/:resonatorId/criteria/submit", component: ResonatorFeedback },
];

const renderRoutes = (routes) => routes.map((route, index) => <Route key={index} exact {...route} />);

const App = (props) => {
    const routesWithLayout = []
        .concat(props.user?.isLeader ? leaderRoutes : [])
        .concat(props.leader?.group_permissions ? leaderGroupRoutes : [])
        .concat(props.user?.isFollower ? followerRoutes : []);

    return (
        <ConnectedRouter history={history}>
            <Switch>
                {renderRoutes(noLayoutRoutes)}
                <Route path="/(.+)">
                    <Layout>
                        <Switch>
                            {renderRoutes(routesWithLayout)}
                            <Route component={NoMatch} />
                        </Switch>
                    </Layout>
                </Route>
                <Route exact path="/" component={HomePage} />
            </Switch>
        </ConnectedRouter>
    );
};

const mapStateToProps = (state) => ({
    user: state.session.user,
    leader: state.leaders.leaders,
});

export default connect(mapStateToProps, null)(App);
