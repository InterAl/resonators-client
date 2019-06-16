import {ActionCreatorHelper} from 'saga-reducer-factory';

const actionsList = [
    'CREATE',
    'DELETE'
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'LEADERCLINICS_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'LEADERCLINICS_');
