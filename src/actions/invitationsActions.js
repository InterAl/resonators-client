import {ActionCreatorHelper} from '../saga-reducers-factory-patch';

const actionsList = [
    'UPDATE',
    'CREATE',
    'DELETE',
    'EDIT',
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'INVITATIONS_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'INVITATIONS_');
