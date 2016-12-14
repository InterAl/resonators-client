import {ActionCreatorHelper} from 'SagaReducerFactory';

const actionsList = [
    'CREATE',
    'ADD_CRITERION'
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'RESONATOR_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'RESONATOR_');
