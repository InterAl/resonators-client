import {ActionCreatorHelper} from '../saga-reducers-factory-patch';

const actionsList = [
    'LOGIN',
    'LOGOUT',
    'RESUME',
    'LOGIN_SUCCESS',
    'REGISTER',
    'GOOGLE_LOGIN',
    'RECOVER_PASSWORD',
    'RESET_PASSWORD',
    'UPDATE_USER_STATE'
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'SESSION_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'SESSION_');
