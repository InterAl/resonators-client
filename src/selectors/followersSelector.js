import _ from 'lodash';
import {createSelector} from 'reselect';

export default createSelector(
    state => state.followers,
    state => state.clinics.clinics,

    (followers, clinics) => {
        return {
            followers: _(followers.followers)
                                .filter(f => followers.displayFrozen || !f.frozen)
                                .filter(f => filterByClinicId(followers, f))
                                .map(f => ({
                                    ...f,
                                    clinicName: getClinicName(clinics, f.clinic_id)
                                }))
                                .sortBy('createdAt')
                                .value(),
            clinics,
            clinicIdFilter: followers.filterByClinicId,
            displayFrozen: followers.displayFrozen
        };
    }
);

function filterByClinicId(followers, follower) {
    return !followers.filterByClinicId ||
            followers.filterByClinicId === 'all' ||
            follower.clinic_id === followers.filterByClinicId
}

function getClinicName(clinics, id) {
    return _.get(_.find(clinics, c => c.id === id), 'name');
}
