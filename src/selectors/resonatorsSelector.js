import _ from 'lodash';
import {createSelector} from 'reselect';

export default createSelector(
    state => state.followers.followers,

    followers => {
        return _(followers).map('resonators').flatten().compact().value();
    }
);
