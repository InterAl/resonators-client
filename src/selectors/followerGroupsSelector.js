import _ from 'lodash';
import {createSelector} from 'reselect';

export default createSelector(
    state => state.followerGroups,
    state => state.clinics.clinics,

    (followerGroups, clinics) => {
        return {
            followerGroups: _(followerGroups.followerGroups)
                                .filter(f => followerGroups.displayFrozen || !f.frozen)
                                .filter(hasClinic(followerGroups.filterByClinicId))
                                .map(fg => ({
                                    ...fg,
                                    clinicName: getClinicName(clinics, fg.clinic_id)
                                }))
                                .sortBy('createdAt')
                                .value(),
            clinics,
            clinicIdFilter: followerGroups.filterByClinicId,
            displayFrozen: followerGroups.displayFrozen,
            groupsFilter: followerGroups.groupsFilter
        };
    }
);


function hasClinic(clinicId) {
    return (followerGroup) =>
        !clinicId
        || clinicId === "all"
        || followerGroup.clinic_id === clinicId
}

function getClinicName(clinics, id) {
    return clinics.find((clinic) => clinic.id === id)?.name

}
