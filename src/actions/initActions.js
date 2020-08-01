import {ActionCreatorHelper} from '../saga-reducers-factory-patch';

const actionsList = [
    'INIT_APP'
];

export const types = ActionCreatorHelper.createTypes(actionsList);
export const actions = ActionCreatorHelper.createActions(actionsList);
