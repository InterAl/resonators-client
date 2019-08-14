import _ from 'lodash';
import SagaReducerFactory from 'saga-reducer-factory';
import { delay } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { actions, types } from '../actions/questionnaireFeedbackActions';
import * as questionnaireFeedbackApi from '../api/questionnaireFeedbackApi';

const pageResonator = window.pageData && window.pageData.resonator;
const questionnaireDt = window.pageData && window.pageData.questionnaire;

let { handle, updateState, saga, reducer } = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
        resonator: pageResonator,
        questionnaire: questionnaireDt,
        currentQuestionIdx: 0
    }
});

const selectQuestionnaireFeedback = () => select(state => state.questionnaireFeedback);

handle(types.SEND_ANSWER, function* (sagaParams, { payload }) {
    try {
        const { answerId } = payload;
        const { resonator, questionnaire, currentQuestionIdx } = yield selectQuestionnaireFeedback();
        yield showSpinner(answerId);

        const idx = Number(currentQuestionIdx);
        questionnaire.row_values[idx][2] = answerId;

        yield put(updateState({
            questionnaire
        }));

        yield delay(750);
        const updateRow = idx + Number(questionnaire.header[1][2]);
        yield call(questionnaireFeedbackApi.sendQuestionnaireAnswer, {
            resonatorId: resonator.id,
            updateRow,
            answerId
        });

        yield showSpinner(null);
    } catch (err) {
        console.log('sending resonator answer failed', err);
        yield showSpinner(null);
    }
});

handle(types.SHOW_PREVIOUS_QUESTION, function* () {
    const { resonator, questionnaire, currentQuestionIdx } = yield selectQuestionnaireFeedback();

    yield put(updateState({
        currentQuestionIdx: Math.max(currentQuestionIdx - 1, 0)
    }));
});

handle(types.SHOW_NEXT_QUESTION, function* () {
    const { resonator, questionnaire, currentQuestionIdx } = yield selectQuestionnaireFeedback();
    const totalQuestionsCount = questionnaire.row_values.length - 1;

    yield put(updateState({
        currentQuestionIdx: Math.min(currentQuestionIdx + 1, totalQuestionsCount)
    }));
});

function showSpinner(questionId, answerId) {
    return put(updateState({ showSpinner: { questionId, answerId } }));
}

export default { saga, reducer };
