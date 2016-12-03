import fetcher from './fetcher';

export function get() {
    return fetcher('/leader_followers');
}

// export function create(name) {
//     return fetcher.post('/user_sessions.json', {
//         name
//     });
// }
//

// export function edit({
//     id,
//     name
// }) {
//     return fetcher.put(`/leader_clinics/${id}`, {
//         id, name
//     });
// }
