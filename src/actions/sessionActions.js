import {ActionCreatorHelper} from 'saga-reducer-factory';

const actionsList = [
    'LOGIN',
    'LOGOUT',
    'RESUME',
    'LOGIN_SUCCESS',
    'REGISTER',
    'GOOGLE_LOGIN',
    'RECOVER_PASSWORD',
    'RESET_PASSWORD'
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'SESSION_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'SESSION_');
