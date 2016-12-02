import {ActionCreatorHelper} from 'SagaReducerFactory';

const actionsList = [
    'INIT_APP'
];

export const types = ActionCreatorHelper.createTypes(actionsList);
export const actions = ActionCreatorHelper.createActions(actionsList);
