import {ActionCreatorHelper} from 'SagaReducerFactory';

const actionsList = [
    'UPDATE',
    'CREATE',
    'DELETE',
    'EDIT',
    'FILTER_BY_CLINIC_ID',
    'SELECT_FOLLOWER'
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'FOLLOWERS_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'FOLLOWERS_');
