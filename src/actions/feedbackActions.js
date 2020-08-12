import {ActionCreatorHelper} from '../saga-reducers-factory-patch';

const actionsList = [
    'SEND_ANSWER',
    'SHOW_PREVIOUS_QUESTION',
    'SHOW_NEXT_QUESTION'
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'RESONATOR_FEEDBACK_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'RESONATOR_FEEDBACK_');
