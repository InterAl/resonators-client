import {ActionCreatorHelper} from 'saga-reducer-factory';

const actionsList = [
    'SEND_ANSWER'
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'RESONATOR_FEEDBACK_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'RESONATOR_FEEDBACK_');
