import {ActionCreatorHelper} from 'SagaReducerFactory';

const actionsList = [
    'NAVIGATE'
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'NAVIGATION_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'NAVIGATION_');
