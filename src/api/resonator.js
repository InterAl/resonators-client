import fetcher from './fetcher';

export function uploadMedia(followerId, resonatorId, file, mediaKind = 'picture') {
    let formData = new FormData();
    formData.append('follower_id', followerId);
    formData.append('reminder_id', resonatorId);
    formData.append('media_kind', mediaKind);
    formData.append('media_title', file.name);
    formData.append('media_data', file);
    return fetcher.upload(`/leader_followers/${followerId}/reminders/${resonatorId}/items`, formData);
}

export function update(followerId, resonator) {
    return fetcher.put(`/leader_followers/${followerId}/reminders/${resonator.id}.json`, resonator);
}

export function remove(followerId, resonatorId) {
    return fetcher.delete(`/leader_followers/${followerId}/reminders/${resonatorId}.json`);
}

export function create(followerId, resonator) {
    return fetcher.post(`/leader_followers/${followerId}/reminders.json`, resonator);
}

export function addCriterion(followerId, resonatorId, criterionId) {
    return fetcher.post(`/leader_followers/${followerId}/reminders/${resonatorId}/criteria`, {
        question_id: criterionId,
        reminder_id: resonatorId
    }, true);
}

export function removeCriterion(followerId, resonatorId, reminderCriterionId) {
    return fetcher.delete(`/leader_followers/${followerId}/reminders/${resonatorId}/criteria/${reminderCriterionId}`);
}
