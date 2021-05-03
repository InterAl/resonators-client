import {ActionCreatorHelper} from '../saga-reducers-factory-patch';

const actionsList = [
    'FETCH',
    'UPDATE',
    'CREATE',
    'DELETE',
    'FREEZE',
    'UNFREEZE',
    'TOGGLE_DISPLAY_FROZEN',
    'FILTER_GROUPS',
    'EDIT',
    'FILTER_BY_CLINIC_ID',
    'FETCH_FOLLOWER_RESONATORS'
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'FOLLOWERS_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'FOLLOWERS_');
