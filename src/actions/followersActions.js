import {ActionCreatorHelper} from 'SagaReducerFactory';

const actionsList = [
    'UPDATE',
    'CREATE',
    'DELETE',
    'EDIT',
    'FILTER_BY_CLINIC_ID',
    'FETCH_FOLLOWER_RESONATORS'
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'FOLLOWERS_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'FOLLOWERS_');
