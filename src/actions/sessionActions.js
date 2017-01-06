import {ActionCreatorHelper} from 'saga-reducer-factory';

const actionsList = [
    'LOGIN',
    'LOGOUT',
    'RESUME',
    'LOGIN_SUCCESS',
    'REGISTER'
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'SESSION_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'SESSION_');
