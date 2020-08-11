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

const leaderRoutes = [
    { exact: true, path: "/followers", component: Followers },
    { exact: false, path: "/followers/:followerId", component: FollowerResonators },
    { exact: true, path: "/followers/:followerId/resonators/new", component: EditResonator },
    { exact: false, path: "/followers/:followerId/resonators/:resonatorId", component: ShowResonator },
    { exact: true, path: "/followers/:followerId/resonators/:resonatorId/edit", component: EditResonator },
    { exact: true, path: "/followers/:followerId/resonators/:resonatorId/stats/:qid", component: ResonatorStats },

    { exact: true, path: "/clinics", component: Clinics },
    { exact: true, path: "/clinics/criteria", component: CriteriaList },
    { exact: true, path: "*/criteria/submit", component: ResonatorFeedback },
    { exact: true, path: "/clinics/criteria/new", component: CriteriaCreation },
    { exact: false, path: "/clinics/criteria/:criterionId", component: CriteriaCreation },
];

const followerRoutes = [
    { exact: true, path: "/follower/resonators", component: ResonatorsOverview },
    { exact: true, path: "/follower/resonators/:sentResonatorId", component: SentResonator },
];

const commonRoutes = [
    { exact: true, path: "/login", component: LoginPage },
    { exact: true, path: "/resetPassword", component: ResetPassword },
];

const App = (props) => {
    const routes = commonRoutes
        .concat(props.user?.isLeader ? leaderRoutes : [])
        .concat(props.user?.isFollower ? followerRoutes : []);

    return (
        <ConnectedRouter history={history}>
            <Switch>
                <Route path="/(.+)">
                    <Layout>
                        <Switch>
                            {routes.map((route, index) => (
                                <Route key={index} {...route} />
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
});

export default connect(mapStateToProps, null)(App);
