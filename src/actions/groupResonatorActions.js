import {ActionCreatorHelper} from '../saga-reducers-factory-patch';

const actionsList = [
    'REMOVE',
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'GROUP_RESONATOR_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'GROUP_RESONATOR_');
