import {ActionCreatorHelper} from "../saga-reducers-factory-patch";

const actionsList = [
    'UPDATE',
    'CREATE',
    'DELETE',
    'FREEZE',
    'UNFREEZE',
    'TOGGLE_DISPLAY_FROZEN',
    'EDIT',
    'FILTER_BY_CLINIC_ID',
    'FETCH_FOLLOWER_GROUP_RESONATORS',
    'FETCH_FOLLOWER_GROUP_MEMBERS',
    'FETCH_MEMBERS_WITH_RESONATOR_CHILDREN',
    'UPDATE_FOLLOWER_GROUP_MEMBERS',
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'FOLLOWER_GROUPS_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'FOLLOWER_GROUPS_');
