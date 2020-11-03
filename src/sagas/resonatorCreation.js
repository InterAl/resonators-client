import _ from 'lodash';
import SagaReducerFactory from '../saga-reducers-factory-patch';
import { call, put, select } from 'redux-saga/effects';
import { actions, types } from '../actions/resonatorCreationActions';
import { actions as navigationActions } from '../actions/navigationActions';
import resonatorsSelector from '../selectors/resonatorsSelector';
import { waitForFollowers, fetchFollowerResonators, updateResonator } from './followersSaga';
import { waitForFollowerGroups, fetchFollowerGroupResonators, updateGroupResonator } from './followerGroupsSaga';
import * as resonatorApi from '../api/resonator';
import * as groupResonatorApi from '../api/groupResonator';
import { types as resonatorTypes } from '../actions/resonatorActions';

const targetFactory = {
    ['follower']: {
        waitForTarget: waitForFollowers,
        fetchResonators: fetchFollowerResonators,
        updateResonator,
        resonatorApi,
        navigationRoute: 'followerResonators',
        targetIdName: 'followerId',
        targetIdDbName: 'follower_id',
    },
    ['followerGroup']: {
        waitForTarget: waitForFollowerGroups,
        fetchResonators: fetchFollowerGroupResonators,
        updateResonator: updateGroupResonator,
        resonatorApi: groupResonatorApi,
        navigationRoute: 'followerGroupResonators',
        targetIdName: 'followerGroupId',
        targetIdDbName: 'follower_group_id',
    }
};

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

handle(types.UPDATE_FINAL, function* (sagaParams, { payload: { targetType } }) {
    yield put(updateState({ showSpinnerFinalUpdate: true }));

    const target = targetFactory[targetType];

    const formData = yield getFormData();
    const targetId = yield select(state => state.resonatorCreation[target.targetIdName]);
    const resonator = yield select(state => state.resonatorCreation.resonator);

    function cleanupOldFile() {
        if (formData.removeOldFile) {

            const lastPicture = _(resonator.items)
                .filter(i => i.media_kind === 'picture')
                .sortBy(i => new Date(i.createdAt))
                .last();
            if (lastPicture)
                return target.resonatorApi.cleanupOldFile(targetId, resonator.id, lastPicture.id);
        }
    }

    function syncMedia() {
        if (formData.imageFile) {
            return target.resonatorApi.uploadMedia(targetId, resonator.id, formData.imageFile);
        }
    }

    function syncCriteria() {
        if (formData.criteria)
            return syncResonatorCriteria(resonator, formData.criteria, target, formData.criteriaOrder);
    }

    function syncCriteriaOrder() {
        if (formData.criteriaOrder)
            return syncResonatorCriteriaOrder(resonator, formData.criteriaOrder, target);
    }

    function syncResonatorData() {
        const payload = convertFormToPayload({ targetId, target, formData });
        payload.id = resonator.id;
        return target.resonatorApi.update(targetId, payload);
    }

    const promise = Promise.all([cleanupOldFile(), syncMedia(), syncCriteria()])
        .then(syncCriteriaOrder).then(syncResonatorData);

    const updatedResonator = yield call(() => promise);
    yield target.updateResonator(targetId, { ...resonator, ...updatedResonator });
    yield put(updateState({ showSpinnerFinalUpdate: false }));
    yield put(navigationActions.navigate({
        route: target.navigationRoute, routeParams: { [target.targetIdName]: targetId }
    }));
});

handle(types.UPDATE_CREATION_STEP, function* (sagaParams, { payload }) {
    const currentFormData = yield select(formDataSelector);

    yield put(updateState({
        formData: {
            ...currentFormData,
            ...payload
        }
    }));
});

handle(types.RESET, function* (sagaParams, { payload: { targetId, targetType, resonatorId } }) {
    const target = targetFactory[targetType];
    yield target.waitForTarget();
    yield target.fetchResonators(targetId);
    const resonators = yield select(resonatorsSelector);
    const resonator = _.find(resonators, (r) => r.id === resonatorId);
    const formData = resonator ? convertResonatorToForm(resonator) : { interval: 1 };

    yield put(updateState({
        [target.targetIdName]: targetId,
        resonator,
        formData,
        editMode: !!resonatorId
    }));
});

handle(resonatorTypes.ACTIVATE, function* (sagaParams, { payload: { targetId, targetType, resonator } }) {
    const target = targetFactory[targetType];

    const updatedResonator = yield call(target.resonatorApi.update, targetId, resonator);

    yield target.updateResonator(targetId, { ...resonator, ...updatedResonator });
    yield put(updateState({ showSpinnerFinalUpdate: false }));
    yield put(navigationActions.navigate({
        route: target.navigationRoute, routeParams: { [target.targetIdName]: targetId }
    }));
});

handle(resonatorTypes.RESET, function* (sagaParams, { payload: { followerId, resonator } }) {

    const parentId = resonator.parent_resonator_id;
    const resonators = yield select(resonatorsSelector);
    const {
        follower_group_id,
        parent_resonator_id,
        id,
        follower_id,
        last_pop_time,
        createdAt,
        updatedAt,
        // Above are all the fields we don't want to reset
        ...parentResonator
    } = _.find(resonators, (r) => r.id === parentId);

    const updatedResonator = yield call(resonatorApi.update, followerId, { ...resonator, ...parentResonator });

    yield updateResonator(followerId, { ...resonator, ...updatedResonator });
    yield put(updateState({ showSpinnerFinalUpdate: false }));
    yield put(navigationActions.navigate({
        route: 'followerResonators', routeParams: { followerId }
    }));
});

handle(types.CREATE, function* (sagaParams, { payload: { targetType } }) {
    const target = targetFactory[targetType];
    const formData = yield getFormData();
    const targetId = yield select(state => state.resonatorCreation[target.targetIdName]);
    const requestPayload = convertFormToPayload({ targetId, target, formData });
    const response = yield call(target.resonatorApi.create, targetId, requestPayload);

    yield put(updateState({
        resonator: response
    }))
});

function syncResonatorCriteria(resonator, newCriteria, target, newOrder = []) {
    let resonatorQuestions = _.map(resonator.questions, 'question_id');
    let addedQids = _.difference(newCriteria, resonatorQuestions);
    let removedQids = _.difference(resonatorQuestions, newCriteria);

    var promisesStack = [];
    let addQuestionsPromises = target.resonatorApi.addBulkCriterion(resonator[target.targetIdDbName], resonator.id, addedQids, newOrder);
    promisesStack.push(addQuestionsPromises);
    let removedQuestionsPromises = _.map(removedQids, qid => {
        let rqid = _.find(resonator.questions, rq => rq.question_id === qid).id;
        return target.resonatorApi.removeCriterion(resonator[target.targetIdDbName], resonator.id, rqid);
    });
    if (removedQuestionsPromises.length > 0) {
        promisesStack.push(removedQuestionsPromises);
    }
    return promisesStack;
}

function syncResonatorCriteriaOrder(resonator, newOrder, target) {
    return target.resonatorApi.reorderCriterion(resonator[target.targetIdDbName], resonator.id, newOrder);
}

function* getFormData() {
    const reduxFormData = yield select(state => state.form.resonatorCreation.values);
    const sagaFormData = yield select(formDataSelector);

    return {
        ...sagaFormData,
        ...reduxFormData
    };
}

function convertFormToPayload({ targetId, target, formData }) {
    const repeat_days = _.reduce([0, 1, 2, 3, 4, 5, 6], (acc, cur) => {
        if (formData[`day${cur}`])
            acc.push(cur);
        return acc;
    }, []);

    const payload = {
        [target.targetIdDbName]: targetId,
        title: formData.title,
        content: formData.description,
        one_off: formData.oneOff === 'on',
        repeat_days,
        interaction_type: formData.interactionType,
        disable_copy_to_leader: formData.sendMeCopy !== 'on',
        link: formData.link,
        pop_email: formData.activated === 'on',
        pop_time: formData.time.toISOString(),
        selected_questionnaire: formData.selectedQuestionnaire,
        questionnaire_details: formData.questionnaireDetails,
        interval: formData.interval,
    };

    return payload;
}

function convertResonatorToForm(resonator) {
    const repeatDays = _.reduce([0, 1, 2, 3, 4, 5, 6], (acc, cur) => {
        acc[`day${cur}`] = _.includes(resonator.repeat_days, cur);
        return acc;
    }, {});
    const criteriaOrder = _.reduce(_.orderBy(resonator.questions, (q) => q.updatedAt), (q, cur) => {
        if (cur.order)
            q[cur.order] = cur.question_id;
        else
            q.push(cur.question_id);
        return q;
    }, []);

    const form = {
        ...repeatDays,
        title: resonator.title,
        description: resonator.content,
        sendMeCopy: resonator.disable_copy_to_leader ? 'off' : 'on',
        interactionType: resonator.interaction_type ? 0 : resonator.interaction_type,
        link: resonator.link,
        activated: resonator.pop_email ? 'on' : 'off',
        time: new Date(resonator.pop_time),
        criteria: _.map(resonator.questions, 'question_id'),
        criteriaOrder: criteriaOrder,
        oneOff: resonator.one_off ? 'on' : 'off',
        selectedQuestionnaire: resonator.selected_questionnaire,
        questionnaireDetails: resonator.questionnaire_details,
        interval: resonator.interval,
    }

    return form;
}

export default { saga, reducer };
