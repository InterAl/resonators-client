import {ActionCreatorHelper} from 'SagaReducerFactory';

let {createTypes, createActions} = ActionCreatorHelper;

const actionsList = [
    'INIT_APP'
];

export const types = createTypes(actionsList);
export const actions = createActions(actionsList);
