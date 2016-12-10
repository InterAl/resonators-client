import fetcher from './fetcher';

export function uploadMedia(followerId, resonatorId, file) {
    return fetcher.post(`/leader_followers/${followerId}/reminders/${resonatorId}/items`, file);
}
