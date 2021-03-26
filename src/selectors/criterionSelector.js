import _ from 'lodash';
import {createSelector} from 'reselect';

export default createSelector(
    state => state.criteria,
    state => state.clinics.clinics,

    (criteria, clinics) => {
        return {
            criteria: _(criteria.criteria)
                                .filter(c => criteria.displayFrozen || !c.removed)
                                .filter(c => filterByClinicId(criteria, c))
                                .map(c => ({
                                    ...c,
                                    clinicName: getClinicName(clinics, c.clinic_id)
                                }))
                                .sort((a, b) => b.is_system - a.is_system || a.createdAt - b.createdAt)
                                .value(),
            clinics,
            clinicIdFilter: criteria.filterByClinicId,
            displayFrozen: criteria.displayFrozen,
        };
    }
);

function filterByClinicId(criteria, criterion) {
    return !criteria.filterByClinicId ||
    criteria.filterByClinicId === 'all' ||
    criteria.clinic_id === criterion.filterByClinicId
}

function getClinicName(clinics, id) {
    return _.get(_.find(clinics, c => c.id === id), 'name');
}
