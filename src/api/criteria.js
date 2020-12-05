import fetcher from './fetcher';

export function get() {
    return fetcher('/leader_clinics/all/criteria.json');
}

export function create(clinicId, criterion) {
    return fetcher.post(`/leader_clinics/${clinicId}/criteria.json`, criterion);
}

export function update(clinicId, criterion) {  
    return fetcher.put(`/leader_clinics/${clinicId}/criteria/${criterion.id}.json`, criterion);
}

export function deleteCriterion(clinicId, criterionId) {
    return fetcher.delete(`/leader_clinics/${clinicId}/criteria/${criterionId}.json`);
}

export function freezeCriterion(criterion) {  
    return fetcher.post(`/leader_clinics/${criterion}/freeze`);
}

export function unfreezeCriterion(criterion) {
    return fetcher.post(`/leader_clinics/${criterion}/unfreeze`);
}