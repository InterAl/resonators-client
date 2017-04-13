const editButtonSelector = '.edit-follower-btn';
const deleteButtonSelector = '.delete-follower-btn';

export const editFollower = nightmare => idx => {
    return openFollowerRowOptions(nightmare, idx)
    .mouseup(editButtonSelector)
    .wait('.edit-follower-modal')
    .wait(1000);
};

export const deleteFollower = nightmare => idx => {
    return openFollowerRowOptions(nightmare, idx)
    .mouseup(deleteButtonSelector)
    .wait('.delete-follower-modal')
    .wait(1000);
};

function openFollowerRowOptions(nightmare, idx) {
    return nightmare
        .mouseup(`.more-options-btn:nth-child(${idx + 1}) button`)
        .wait(".edit-follower-modal input[name='name']")
        .screenshot('uu')
}
