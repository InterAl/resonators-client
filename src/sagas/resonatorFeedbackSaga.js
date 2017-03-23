import SagaReducerFactory from 'saga-reducer-factory';
import { put, call, select } from 'redux-saga/effects';
import { actions, types } from '../actions/feedbackActions';
import * as resonatorFeedbackApi from '../api/resonatorFeedbackApi';

const pageResonator = window.pageData && window.pageData.resonator;

let {handle, updateState, saga, reducer} = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
        resonator: pageResonator,
        answered: {},
        currentQuestionIdx: pageResonator && _.size(pageResonator.questions) - 2
    }
});

const selectResonatorFeedback = () => select(state => state.resonatorFeedback);

handle(types.SEND_ANSWER, function*(sagaParams, {payload}) {
    try {
        const {questionId, answerId} = payload;
        const {resonator, answered, currentQuestionIdx} = yield selectResonatorFeedback();
        const {sent_resonator_id} = yield select(state => state.init.query);
        yield showSpinner(questionId, answerId);

        yield call(resonatorFeedbackApi.sendAnswer, {
            resonatorId: resonator.id,
            questionId,
            answerId,
            sentResonatorId: sent_resonator_id
        });

        yield put(updateState({
            answered: {
                ...answered,
                questionId: answerId
            },
            currentQuestionIdx: currentQuestionIdx - 1
        }));
        yield showSpinner(null);
    } catch (err) {
        console.log('sending resonator answer failed', err);
        yield showSpinner(null);
    }
});

function showSpinner(questionId, answerId) {
    return put(updateState({ showSpinner: {questionId, answerId} }));
}

export default {saga, reducer};
