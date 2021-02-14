import fetcher from './fetcher';

export function uploadMedia(followerGroupId, resonatorId, file, mediaKind = 'picture') {
    let formData = new FormData();
    formData.append('follower_group_id', followerGroupId);
    formData.append('reminder_id', resonatorId);
    formData.append('media_kind', mediaKind);
    formData.append('media_title', file.name);
    formData.append('media_data', file);
    return fetcher.upload(`/leader_followerGroups/${followerGroupId}/reminders/${resonatorId}/items`, formData);
}

export function createResonatorAttachment(followerGroupId, resonatorId, link) {
    return fetcher.post(`/leader_followerGroups/${followerGroupId}/reminders/${resonatorId}/attachment`, {resonatorId, link});
}

export function update(followerGroupId, resonator) {
    return fetcher.put(`/leader_followerGroups/${followerGroupId}/reminders/${resonator.id}.json`, resonator);
}

export function remove(followerGroupId, resonatorId) {
    return fetcher.delete(`/leader_followerGroups/${followerGroupId}/reminders/${resonatorId}.json`);
}

export function create(followerGroupId, resonator) {
    return fetcher.post(`/leader_followerGroups/${followerGroupId}/reminders.json`, resonator);
}

export function addCriterion(followerGroupId, resonatorId, criterionId) {
    return fetcher.post(`/leader_followerGroups/${followerGroupId}/reminders/${resonatorId}/criteria`, {
        question_id: criterionId,
        reminder_id: resonatorId
    }, true);
}
export function addBulkCriterion(followerGroupId, resonatorId, criterionId) {
    return fetcher.post(`/leader_followerGroups/${followerGroupId}/reminders/${resonatorId}/criteria`, {
        question_id: criterionId,
        reminder_id: resonatorId
    }, true);
}
export function removeCriterion(followerGroupId, resonatorId, reminderCriterionId) {
    return fetcher.delete(`/leader_followerGroups/${followerGroupId}/reminders/${resonatorId}/criteria/${reminderCriterionId}`);
}

export function reorderCriterion(followerId, resonatorId, criteriaOrder) {
    return fetcher.post(`/leader_followers/${followerId}/reminders/${resonatorId}/criteria/reorder`, {
        criteria_order: criteriaOrder,
        reminder_id: resonatorId
    }, true);
}

export function cleanupOldFile(followerGroupId, resonatorId, itemId)
{
    return fetcher.delete(`/leader_followerGroups/${followerGroupId}/reminders/${resonatorId}/removeImage/${itemId}`);
}

