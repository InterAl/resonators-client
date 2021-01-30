import fetcher from './fetcher';

export function get() {
    return fetcher('/invitations');
}

export function create({title, subject, body}) {
    return fetcher.post('/invitations', {
        title,
        subject,
        body
    });
}

export function edit({id, title, subject, body}) {
    return fetcher.put(`/invitations/${id}`, {
        title,
        subject,
        body
    });
}

export function deleteInvitation(id) {
    return fetcher.delete(`/invitations/${id}`);
}
