import fetcher from './fetcher';

export function get() {
    return fetcher('/leader_clinics/all/criteria.json');
}
