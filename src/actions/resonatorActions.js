import {ActionCreatorHelper} from 'SagaReducerFactory';

const actionsList = [
    'CREATE',
    'UPDATE_CREATION_STEP'
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'RESONATOR_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'RESONATOR_');
