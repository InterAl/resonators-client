import {ActionCreatorHelper} from 'saga-reducer-factory';

const actionsList = [
    'CREATE_CRITERION',
    'UPDATE_CRITERION',
    'DELETE_CRITERION'
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'CRITERIA_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'CRITERIA_');
