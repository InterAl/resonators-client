import {createSelector} from 'reselect';

export default createSelector(
    state => state.session,

    session => ({
        user: session.user,
        loggedIn: session.loggedIn
    })
);
