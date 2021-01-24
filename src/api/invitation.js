import fetcher from './fetcher';

export function get() {
    return fetcher('/invitations');
}

export function create({subject, body}) {
    return fetcher.post('/invitations', {
        subject,
        body
    });
}

export function edit({id, subject, body}) {
    return fetcher.put(`/invitations/${id}`, {
        subject,
        body
    });
}

export function deleteInvitation(id) {
    return fetcher.delete(`/invitations/${id}`);
}
