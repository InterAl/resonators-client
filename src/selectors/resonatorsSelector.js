import _ from 'lodash';
import {createSelector} from 'reselect';

export default createSelector(
    (state) => state.followers.followers,
    (state) => state.followerGroups.followerGroups,

    (followers, followerGroups) => {
        return [
            ...(_(followers).map('resonators').flatten().compact().value()),
            ...(_(followerGroups).map('resonators').flatten().compact().value()),
        ];
    }
);
