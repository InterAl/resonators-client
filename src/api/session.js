import fetcher from './fetcher';

export function get() {
    return fetcher('/user_sessions');
}

export function create(email, password) {
    return fetcher.post('/user_sessions.json', {
        email,
        password
    });
}

export function logout(id) {
    return fetcher(`/user_sessions/${id}.json`, {
        method: 'DELETE',
        emptyResponse: true
    });
}

export function register(email, name, password) {
    return fetcher.post('/users.json', {
        email,
        name,
        password
    });
}
