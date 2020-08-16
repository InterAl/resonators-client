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
import FollowerGroups from './FollowerGroups';
import LoginPage from "./LoginPage";
import CriteriaList from "./CriteriaList";
import ShowResonator from "./ShowResonator";
import EditResonator from "./EditResonator";
import ResetPassword from "./ResetPassword";
import ResonatorStats from "./ResonatorStats";
import ResonatorFeedback from "./ResonatorFeedback";
import SentResonator from "./followers/SentResonator";
import FollowerResonators from "./FollowerResonators";
import FollowerGroupResonators from './FollowerGroupResonators';
import FollowerGroupMembers from './FollowerGroupMembers';
import CriteriaCreation from "./CriteriaCreation/index";
import ResonatorsOverview from "./followers/ResonatorsOverview";

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
    { path: "/followerGroups/:followerGroupId/resonators/new", component: EditResonator},
    { path: "/followerGroups/:followerGroupId/resonators/:resonatorId/edit", component: EditResonator},
    { path: "/followerGroups/:followerGroupId/resonators/:resonatorId/stats/:qid", component: ResonatorStats},
    { path: "/followerGroups/:followerGroupId/resonators/:resonatorId", component: ShowResonator},
    { path: "/followerGroups/:followerGroupId/members", component: FollowerGroupMembers},
    { path: "/followerGroups/:followerGroupId/resonators", component: FollowerGroupResonators},
    { path: "/followerGroups", component: FollowerGroups},
];

const followerRoutes = [
    { path: "/follower/resonators", component: ResonatorsOverview },
    { path: "/follower/resonators/:sentResonatorId", component: SentResonator },
];

const commonRoutes = [
    { path: "/login", component: LoginPage },
    { path: "/resetPassword", component: ResetPassword },

    { path: "*/criteria/submit", component: ResonatorFeedback },
];

const App = (props) => {
    const routes = commonRoutes
        .concat(props.user?.isLeader ? leaderRoutes : [])
        .concat(props.leader?.group_permissions ? leaderGroupRoutes : [])
        .concat(props.user?.isFollower ? followerRoutes : []);

    return (
        <ConnectedRouter history={history}>
            <Switch>
                <Route path="/(.+)">
                    <Layout>
                        <Switch>
                            {routes.map((route, index) => (
                                <Route key={index} exact {...route} />
                            ))}

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
