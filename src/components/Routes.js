import React from 'react';
import Followers from './Followers';
import NoMatch from './NoMatch';
import Visitor from './Visitor';
import FollowerResonators from './FollowerResonators';
import EditResonator from './EditResonator';
import { Route } from 'react-router';

export default (
    <Route path="/">
        <Route path="react" component={Visitor} />
        <Route path="react/followers" component={Followers} />
        <Route path="react/followers/:followerId/resonators" component={FollowerResonators}>
            <Route path="/new" component={EditResonator} />
        </Route>
        <Route path="/*" component={NoMatch} />
    </Route>
);
