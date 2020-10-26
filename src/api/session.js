import fetcher from './fetcher';

export function get() {
    return fetcher('/user_sessions');
}

export function create(email, password, isLeader) {
    return fetcher.post('/user_sessions.json', {
        email,
        password,
        isLeader
    });
}

export function logout() {
    return fetcher(`/user_sessions`, {
        method: 'DELETE',
        emptyResponse: true
    });
}

export function register(email, name, password, isLeader) {
    return fetcher.post('/users.json', {
        email,
        name,
        password,
        isLeader
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

export function startGoogleLogin(isLeader) {
    return fetcher.post('/startGoogleLogin', {
        isLeader
    });
}
