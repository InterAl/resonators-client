import {createSelector} from 'reselect';

export default createSelector(
    state => state.criteria,

    criteria => criteria.criteria
);
