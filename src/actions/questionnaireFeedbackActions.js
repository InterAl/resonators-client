import {ActionCreatorHelper} from 'saga-reducer-factory';

const actionsList = [
    'SEND_ANSWER',
    'SHOW_PREVIOUS_QUESTION',
    'SHOW_NEXT_QUESTION'
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'QUESTIONNAIRE_FEEDBACK_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'QUESTIONNAIRE_FEEDBACK_');
