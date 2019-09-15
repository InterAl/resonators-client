import _ from 'lodash';
import SagaReducerFactory from 'saga-reducer-factory';
import { delay } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { actions, types } from '../actions/dailyDiaryFeedbackActions';
import * as dailyDiaryFeedbackApi from '../api/dailyDiaryFeedbackApi';

const pageResonator = window.pageData && window.pageData.resonator;
const dailyDiaryDt = window.pageData && window.pageData.diary_data;

let { handle, updateState, saga, reducer } = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
        resonator: pageResonator,
        diaryData: dailyDiaryDt,
        currentRowIdx: 0,
        currentColumnIdx:0
    }
});

const selectDiaryFeedback = () => select(state => state.dailyDiaryFeedback);

handle(types.SEND_ANSWER, function* (sagaParams, { payload }) {
    try {
        const { answerId } = payload;
        const { resonator, diaryData, currentRowIdx, currentColumnIdx } = yield selectDiaryFeedback();
        yield showSpinner(answerId);

        const row_idx = Number(currentRowIdx);
        const col_idx = Number(currentColumnIdx + 1);
        diaryData.row_values[row_idx][col_idx] = answerId;

        yield put(updateState({
            diaryData
        }));

        yield delay(750);
        const updateRow = row_idx + Number(diaryData.header[1][2]);
        const updateCol = col_idx;
        yield call(dailyDiaryFeedbackApi.sendDiaryAnswer, {
            resonatorId: resonator.id,
            updateRow,
            updateCol,
            answerId
        });

        yield showSpinner(null);
    } catch (err) {
        console.log('sending resonator answer failed', err);
        yield showSpinner(null);
    }
});

handle(types.SHOW_PREVIOUS_ENTRY, function* () {
    const { resonator, diaryData, currentRowIdx, currentColumnIdx } = yield selectDiaryFeedback();

    yield put(updateState({
        currentRowIdx: Math.max(currentRowIdx - 1, 0),
        // currentColumnIdx: 0
    }));
});

handle(types.SHOW_NEXT_ENTRY, function* () {
    const { resonator, diaryData, currentRowIdx, currentColumnIdx } = yield selectDiaryFeedback();
    const totalQuestionsCount = diaryData.row_values.length - 1;

    yield put(updateState({
        currentRowIdx: Math.min(currentRowIdx + 1, totalQuestionsCount),
        // currentColumnIdx:0
    }));
});

handle(types.SHOW_PREVIOUS_COLUMN, function* () {
    const { resonator, diaryData, currentRowIdx, currentColumnIdx } = yield selectDiaryFeedback();
    let canShowPrev = false;
    if ((currentColumnIdx - 1) >= 0) {
        canShowPrev = diaryData.header[4][(currentColumnIdx - 1)] === 'SHOW';
    }

    yield put(updateState({
        currentColumnIdx: Math.max(currentColumnIdx - (canShowPrev ? 1 : 2), 0)
    }));
});

handle(types.SHOW_NEXT_COLUMN, function* () {
    const { resonator, diaryData, currentRowIdx, currentColumnIdx } = yield selectDiaryFeedback();
    const columnCount = diaryData.header[8].length - 1;
    let canShowNext = false;
    if ((currentColumnIdx + 1) < columnCount) {
        canShowNext = diaryData.header[4][(currentColumnIdx + 1)] === 'SHOW';
    }
    yield put(updateState({
        currentColumnIdx: Math.min(currentColumnIdx + (canShowNext ? 1 : 2), columnCount)
    }));
});

function showSpinner(questionId, answerId) {
    return put(updateState({ showSpinner: { questionId, answerId } }));
}

export default { saga, reducer };
