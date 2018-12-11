import {ActionCreatorHelper} from 'saga-reducer-factory';

const actionsList = [
    'UPDATE'
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'LEADER_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'LEADER_');