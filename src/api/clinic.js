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
export function saveSettings({phone, website, QRImage, logo, name, therapistName, therapistPicture}) {
    return fetcher.post('/leader_clinics/clinic_settings', {
        phone,
        website,
        QRImage,
        logo,
        name,
        therapistName,
        therapistPicture
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
