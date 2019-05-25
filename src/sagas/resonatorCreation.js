import _ from 'lodash';
import SagaReducerFactory from 'saga-reducer-factory';
import { call, put, select } from 'redux-saga/effects';
import { actions, types } from '../actions/resonatorCreationActions';
import { actions as navigationActions } from '../actions/navigationActions';
import resonatorsSelector from '../selectors/resonatorsSelector';
import { waitForFollowers, fetchFollowerResonators, updateResonator } from './followersSaga';
import * as resonatorApi from '../api/resonator';
import { types as resonatorTypes } from '../actions/resonatorActions';

let { handle, updateState, saga, reducer } = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
        formData: {},
        showSpinnerFinalUpdate: false,
        resonator: null
    }
});

const formDataSelector = state => state.resonatorCreation.formData;

handle(types.UPDATE_FINAL, function* () {
    yield put(updateState({ showSpinnerFinalUpdate: true }));

    let formData = yield getFormData();
    let followerId = yield select(state => state.resonatorCreation.followerId);
    let resonator = yield select(state => state.resonatorCreation.resonator);

    function cleanupOldFile() {
        if (formData.removeOldFile) {

            let lastPicture = _(resonator.items)
                .filter(i => i.media_kind === 'picture')
                .sortBy(i => new Date(i.created_at))
                .last();
            if (lastPicture)
                return resonatorApi.cleanupOldFile(followerId, resonator.id, lastPicture.id);
        }
    }

    function syncMedia() {
        if (formData.imageFile) {
            return resonatorApi.uploadMedia(followerId, resonator.id, formData.imageFile);
        }
    }

    function syncCriteria() {
        if (formData.criteria)
            return syncResonatorCriteria(resonator, formData.criteria);
    }

    function syncResonatorData() {
        let payload = convertFormToPayload(followerId, formData);
        payload.id = resonator.id;
        return resonatorApi.update(followerId, payload);
    }

    let promise = Promise.all([cleanupOldFile(), syncMedia(), syncCriteria()])
        .then(syncResonatorData);

    const updatedResonator = yield call(() => promise);
    yield updateResonator(followerId, { ...resonator, ...updatedResonator });
    yield put(updateState({ showSpinnerFinalUpdate: false }));
    yield put(navigationActions.navigate({
        route: 'followerResonators', routeParams: { followerId }
    }));
});

handle(types.UPDATE_CREATION_STEP, function* (sagaParams, { payload }) {
    let currentFormData = yield select(formDataSelector);

    yield put(updateState({
        formData: {
            ...currentFormData,
            ...payload
        }
    }));
});

handle(types.RESET, function* (sagaParams, { payload: { followerId, resonatorId } }) {
    yield waitForFollowers();
    yield fetchFollowerResonators(followerId);
    let resonators = yield select(resonatorsSelector);
    let resonator = _.find(resonators, r => r.id === resonatorId);
    let formData = resonator ? convertResonatorToForm(resonator) : {};

    yield put(updateState({
        followerId,
        resonator,
        formData,
        editMode: !!resonatorId
    }));
});

handle(resonatorTypes.ACTIVATE, function* (sagaParams, { payload }) {

    const { followerId, resonator } = payload;

    const updatedResonator = yield call(resonatorApi.update, followerId, resonator);

    yield updateResonator(followerId, { ...resonator, ...updatedResonator });
    yield put(updateState({ showSpinnerFinalUpdate: false }));
    yield put(navigationActions.navigate({
        route: 'followerResonators', routeParams: { followerId }
    }));
});

handle(types.CREATE, function* () {
    let formData = yield getFormData();
    let followerId = yield select(state => state.resonatorCreation.followerId);
    let requestPayload = convertFormToPayload(followerId, formData);
    let response = yield call(resonatorApi.create, followerId, requestPayload);

    yield put(updateState({
        resonator: response
    }))
});

function syncResonatorCriteria(resonator, newCriteria) {
    let resonatorQuestions = _.map(resonator.questions, 'question_id');
    let addedQids = _.difference(newCriteria, resonatorQuestions);
    let removedQids = _.difference(resonatorQuestions, newCriteria);

    //why setTimeout? because the insert time is our only way of ordering the
    //questions in the server. A dirty hack indeed.
    // let addQuestionsPromises = _.map(addedQids, (qid, idx) => delay(() => resonatorApi.addCriterion(resonator.follower_id, resonator.id, qid), (idx + 1) * 10));
    var promisesStack = [];
    let addQuestionsPromises = resonatorApi.addBulkCriterion(resonator.follower_id, resonator.id, addedQids);
    promisesStack.push(addQuestionsPromises);
    let removedQuestionsPromises = _.map(removedQids, qid => {
        let rqid = _.find(resonator.questions, rq => rq.question_id === qid).id;
        return resonatorApi.removeCriterion(resonator.follower_id, resonator.id, rqid);
    });
    if (removedQuestionsPromises.length > 0) {
        promisesStack.push(removedQuestionsPromises);
    }
    return promisesStack;
}

function* getFormData() {
    let reduxFormData = yield select(state => state.form.resonatorCreation.values);
    let sagaFormData = yield select(formDataSelector);

    return {
        ...sagaFormData,
        ...reduxFormData
    };
}

function convertFormToPayload(followerId, formData) {
    let repeat_days = _.reduce([0, 1, 2, 3, 4, 5, 6], (acc, cur) => {
        if (formData[`day${cur}`])
            acc.push(cur);
        return acc;
    }, []);

    let payload = {
        follower_id: followerId,
        title: formData.title,
        content: formData.description,
        repeat_days,
        disable_copy_to_leader: formData.sendMeCopy !== 'on',
        link: formData.link,
        pop_email: formData.activated === 'on',
        pop_time: formData.time.toISOString(),
    };

    return payload;
}

function convertResonatorToForm(resonator) {
    let repeatDays = _.reduce([0, 1, 2, 3, 4, 5, 6], (acc, cur) => {
        acc[`day${cur}`] = _.includes(resonator.repeat_days, cur);
        return acc;
    }, {});

    let form = {
        ...repeatDays,
        title: resonator.title,
        description: resonator.content,
        sendMeCopy: resonator.disable_copy_to_leader ? 'off' : 'on',
        link: resonator.link,
        activated: resonator.pop_email ? 'on' : 'off',
        time: new Date(resonator.pop_time),
        criteria: _.map(resonator.questions, 'question_id')
    }

    return form;
}

function delay(fn, timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                fn();
            } catch (err) {
                return reject(err);
            }

            resolve();
        }, timeout);
    });
}

export default { saga, reducer };
