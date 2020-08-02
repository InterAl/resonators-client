import fetcher from './fetcher';

export function get() {
    return fetcher('/leader_followerGroups');
}

export function create({group_name, clinic}) {
    return fetcher.post('/leader_followerGroups.json', {
        group_name,
        clinic_id: clinic
    });
}

export function edit({
    id,
    group_name,
}) {
    return fetcher.put(`/leader_followerGroups/${id}`, {
        id,
        group_name,
    });
}

export function deleteFollowerGroup(id) {
    return fetcher.delete(`/leader_followerGroups/${id}`);
}

export function freezeFollowerGroup(id) {
    return fetcher.post(`/leader_followerGroups/${id}/freeze`);
}

export function unfreezeFollowerGroup(id) {
    return fetcher.post(`/leader_followerGroups/${id}/unfreeze`);
}

export function deleteGroupResonator(followerGroupId, resonatorId) {
    return fetcher.delete(`/leader_followerGroups/${followerGroupId}/reminders/${resonatorId}`);
}

export function getGroupResonators(followerGroupId) {
    return fetcher(`/leader_followerGroups/${followerGroupId}/reminders.json`);
}

export function getGroupMembers(followerGroupId) {
    return fetcher(`/leader_followerGroups/${followerGroupId}/followers.json`);
}
