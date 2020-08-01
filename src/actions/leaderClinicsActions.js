import {ActionCreatorHelper} from '../saga-reducers-factory-patch';

const actionsList = [
    'CREATE',
    'DELETE'
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'LEADERCLINICS_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'LEADERCLINICS_');
