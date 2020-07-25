import _ from 'lodash';
import {createSelector} from 'reselect';

export default createSelector(
    state => state.followerGroups,
    state => state.clinics.clinics,

    (followerGroups, clinics) => {
        return {
            followerGroups: _(followerGroups.followerGroups)
                                .filter(f => followerGroups.displayFrozen || !f.frozen)
                                .filter(fg => filterByClinicId(followerGroups, fg))
                                .map(fg => ({
                                    ...fg,
                                    clinicName: getClinicName(clinics, fg.clinic_id)
                                }))
                                .sortBy('created_at')
                                .value(),
            clinics,
            clinicIdFilter: followerGroups.filterByClinicId,
            displayFrozen: followerGroups.displayFrozen,
        };
    }
);

function filterByClinicId(followerGroups, followerGroup) {
    return !followerGroups.filterByClinicId ||
            followerGroups.filterByClinicId === 'all' ||
            followerGroup.clinic_id === followerGroups.filterByClinicId
}

function getClinicName(clinics, id) {
    return _.get(_.find(clinics, c => c.id === id), 'name');
}
