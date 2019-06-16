import fetcher from './fetcher';

export function get() {
    return fetcher('/leader_clinics');
}

export function create(name) {
    return fetcher.post('/user_sessions.json', {
        name
    });
}
export function addLeaderToClinic(email, clinic_id) {
    return fetcher.post('/leader_clinics.json', {
        email,
        clinic_id
    });
}
export function edit({
    id,
    name
}) {
    return fetcher.put(`/leader_clinics/${id}`, {
        id, name
    });
}
