import {ActionCreatorHelper} from '../saga-reducers-factory-patch';

const actionsList = [
    'UPDATE'
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'LEADER_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'LEADER_');