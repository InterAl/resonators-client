import {createSelector} from 'reselect';

export default createSelector(
    state => state.invitations,

    invitations => {
        return { invitations: invitations.invitations };
    }
);
