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
    return fetcher(`/user_sessions`, {
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

export function recoverPassword(email) {
    return fetcher.post('/user_password_resets.json', {
        email
    });
}

export function resetPassword({ password, token }) {
    return fetcher.post('/changePassword', {
        token,
        password
    });
}
