import {ActionCreatorHelper} from '../saga-reducers-factory-patch';

const actionsList = [
    'CREATE',
    'ADD_CRITERION',
    'REMOVE',
    'ACTIVATE'
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'RESONATOR_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'RESONATOR_');
