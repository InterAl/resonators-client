import {ActionCreatorHelper} from 'saga-reducer-factory';

const actionsList = [
    'SEND_ANSWER',
    'SHOW_PREVIOUS_ENTRY',
    'SHOW_NEXT_ENTRY',
    'SHOW_PREVIOUS_COLUMN',
    'SHOW_NEXT_COLUMN'
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'DIARY_FEEDBACK_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'DIARY_FEEDBACK_');
