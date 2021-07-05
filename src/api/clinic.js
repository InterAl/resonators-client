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
export function saveSettings({phone, website, name, email, logo, qr, therapistPicture, therapistName}) {
    return fetcher.post('/leader_clinics/clinic_settings', {
        phone,
        website,
        name,
        email,
        logo,
        qr,
        therapistName,
        therapistPicture
    });
}
export function uploadMedia(fieldName, file, mediaKind = 'picture') {
    let formData = new FormData();
    formData.append('field_name', fieldName);
    formData.append('media_kind', mediaKind);
    formData.append('media_title', file.name);
    formData.append('media_data', file);
    return fetcher.upload('/leader_clinics/clinic_settings/upload', formData);
}
export function edit({
    id,
    name
}) {
    return fetcher.put(`/leader_clinics/${id}`, {
        id, name
    });
}
