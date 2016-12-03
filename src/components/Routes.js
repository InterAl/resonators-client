import React from 'react';
import Followers from './Followers';
import NoMatch from './NoMatch';
import Visitor from './Visitor';
import { Route } from 'react-router';

export default (
    <Route path="/">
        <Route path="react" component={Visitor} />
        <Route path="react/followers" component={Followers} />
        <Route path="/*" component={NoMatch} />
    </Route>
);
