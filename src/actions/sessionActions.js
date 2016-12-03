import {ActionCreatorHelper} from 'SagaReducerFactory';

const actionsList = [
    'LOGIN',
    'LOGOUT',
    'RESUME'
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'SESSION_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'SESSION_');
